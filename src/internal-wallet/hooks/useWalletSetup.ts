/**
 * Hook for the wallet sign-up flow.
 * Manages the multi-step wizard state and wallet creation.
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useJumperWalletStore } from '@/stores/jumperWallet/JumperWalletStore';
import {
  isWebAuthnAvailable,
  isPRFSupported,
} from '@/internal-wallet/crypto/webauthn';
import type {
  ShamirShare,
  ShareStorageType,
} from '@/internal-wallet/crypto/types';
import type {
  AdapterFields,
  AdaptersWithFields,
} from '@/internal-wallet/recovery/adapters/ShareStorageAdapter.types';
import { type ShareStatus } from '@/components/JumperWallet/common/ShareStatusCard';

// Evaluated once at module load — stable for the lifetime of the page.
const webAuthnAvailable = isWebAuthnAvailable();

export const MIN_SHARES = 3;
export const MIN_THRESHOLD = 2;

/**
 * Translation key suffixes for each wizard step (prefixed with `jumperWallet.` in the UI).
 * Recovery setup now comes before biometric so shares can be configured before wallet creation.
 * Step 2 (biometric) is skipped automatically when WebAuthn/PRF is unavailable.
 */
export const SIGNUP_STEPS = [
  'signup.createPassword',
  'signup.recoverySetup',
  'signup.biometricSetup',
  'signup.distributing',
  'signup.disclaimer',
] as const;

export type ShareDistributionStatus = ShareStatus;

export interface ShareDistributionEntry {
  type: ShareStorageType;
  status: ShareDistributionStatus;
  error?: string;
}

export interface SetupState {
  password: string;
  confirmPassword: string;
  shares: ShamirShare[];
  address: `0x${string}` | null;
  isCreating: boolean;
  error: string | null;
  /** Which share adapters are enabled for distribution */
  enabledAdapters: Record<ShareStorageType, boolean>;
  /** User-provided field values for adapters that require them */
  adapterFields: Partial<AdapterFields>;
  /** Live distribution status per adapter (populated during step 3) */
  distribution: ShareDistributionEntry[];
  /** Number of shares required to recover (must be >= MIN_THRESHOLD and < totalEnabled) */
  threshold: number;
}

const DEFAULT_ENABLED_ADAPTERS: Record<ShareStorageType, boolean> = {
  localStorage: true,
  email: true,
  googleDrive: true,
  recoveryCode: true,
};

const initialState: SetupState = {
  password: '',
  confirmPassword: '',
  shares: [],
  address: null,
  isCreating: false,
  error: null,
  enabledAdapters: { ...DEFAULT_ENABLED_ADAPTERS },
  adapterFields: {},
  distribution: [],
  threshold: MIN_THRESHOLD,
};

export function useWalletSetup() {
  const [state, setState] = useState<SetupState>(initialState);
  const [prfAvailable, setPrfAvailable] = useState(false);
  const [isDisclaimerReady, setIsDisclaimerReady] = useState(false);

  useEffect(() => {
    if (webAuthnAvailable) {
      isPRFSupported().then(setPrfAvailable);
    }
  }, []);

  const biometricAvailable = webAuthnAvailable && prfAvailable;
  const signupStep = useJumperWalletStore((s) => s.signupStep);
  const setSignupStep = useJumperWalletStore((s) => s.setSignupStep);
  const createWallet = useJumperWalletStore((s) => s.createWallet);
  const setShamirConfig = useJumperWalletStore((s) => s.setShamirConfig);
  const resolveConnectRequest = useJumperWalletStore(
    (s) => s.resolveConnectRequest,
  );
  const setFlow = useJumperWalletStore((s) => s.setFlow);
  const updateStoredShareTypes = useJumperWalletStore(
    (s) => s.updateStoredShareTypes,
  );

  const setPassword = useCallback((password: string) => {
    setState((prev) => ({ ...prev, password, error: null }));
  }, []);

  const setConfirmPassword = useCallback((confirmPassword: string) => {
    setState((prev) => ({ ...prev, confirmPassword, error: null }));
  }, []);

  const setAdapterField = useCallback(
    <K extends AdaptersWithFields>(type: K, value: AdapterFields[K]) => {
      setState((prev) => ({
        ...prev,
        adapterFields: { ...prev.adapterFields, [type]: value },
      }));
    },
    [],
  );

  const toggleAdapter = useCallback(
    (type: ShareStorageType, enabled: boolean) => {
      setState((prev) => {
        const newAdapters = { ...prev.enabledAdapters, [type]: enabled };
        const newCount = Object.values(newAdapters).filter(Boolean).length;
        // Auto-clamp threshold if reducing adapter count makes it invalid
        const clampedThreshold = Math.max(
          MIN_THRESHOLD,
          Math.min(prev.threshold, newCount - 1),
        );
        return {
          ...prev,
          enabledAdapters: newAdapters,
          threshold: clampedThreshold,
        };
      });
    },
    [],
  );

  const setThreshold = useCallback(
    (threshold: number) => {
      const enabledCount = Object.values(state.enabledAdapters).filter(
        Boolean,
      ).length;
      const clamped = Math.max(
        MIN_THRESHOLD,
        Math.min(threshold, enabledCount - 1),
      );
      setState((prev) => ({ ...prev, threshold: clamped }));
    },
    [state.enabledAdapters],
  );

  const updateDistributionStatus = useCallback(
    (
      type: ShareStorageType,
      status: ShareDistributionStatus,
      error?: string,
    ) => {
      setState((prev) => ({
        ...prev,
        distribution: prev.distribution.map((d) =>
          d.type === type ? { ...d, status, error } : d,
        ),
      }));
    },
    [],
  );

  /**
   * Step 1 → Step 2: Create the wallet with the user-configured shamir settings.
   * Generates mnemonic, encrypts, splits into shares.
   * Also initialises the distribution entries so they're ready for step 3.
   */
  const handleCreateWallet = useCallback(async () => {
    setState((prev) => ({ ...prev, isCreating: true, error: null }));

    try {
      const totalShares = Object.values(state.enabledAdapters).filter(
        Boolean,
      ).length;

      // Push the user-configured shamir settings into the store before creating
      setShamirConfig({ totalShares, threshold: state.threshold });

      const result = await createWallet(state.password);

      // Build distribution entries from enabled adapters
      const distribution = (
        Object.entries(state.enabledAdapters) as [ShareStorageType, boolean][]
      )
        .filter(([, v]) => v)
        .map(([type]): ShareDistributionEntry => ({ type, status: 'idle' }));

      setState((prev) => ({
        ...prev,
        shares: result.shares,
        address: result.address,
        distribution,
        isCreating: false,
      }));

      setSignupStep(biometricAvailable ? 2 : 3);
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isCreating: false,
        error: err instanceof Error ? err.message : 'Failed to create wallet',
      }));
      return false;
    }
  }, [
    state.enabledAdapters,
    state.threshold,
    state.password,
    biometricAvailable,
    setShamirConfig,
    createWallet,
    setSignupStep,
  ]);

  /**
   * Complete the sign-up flow.
   * Resolves the pending connect request so the wagmi connector connects.
   */
  const completeSetup = useCallback(async () => {
    const storedTypes = state.distribution
      .filter((d) => d.status === 'done')
      .map((d) => d.type);
    await updateStoredShareTypes(storedTypes, state.adapterFields);

    if (state.address) {
      resolveConnectRequest(state.address);
    }
    setFlow('idle');
    setState(initialState);
  }, [
    state.address,
    state.distribution,
    state.adapterFields,
    resolveConnectRequest,
    setFlow,
    updateStoredShareTypes,
  ]);

  /**
   * Cancel the sign-up flow.
   */
  const cancelSetup = useCallback(() => {
    resolveConnectRequest(null);
    setFlow('idle');
    setState(initialState);
    setSignupStep(0);
  }, [resolveConnectRequest, setFlow, setSignupStep]);

  /**
   * Advance to the next wizard step.
   *
   * Step 0 (createPassword) → validates password, advances to step 1.
   * Step 1 (recoverySetup)  → creates wallet with configured shamir settings, advances to step 2 or 3.
   * Step 3 (distributing)   → advances to step 4 (disclaimer).
   * Step 4 (disclaimer)     → completes setup.
   *
   * Step 2 (biometricSetup) advances via its own onComplete callback.
   */
  const advance = useCallback(async () => {
    switch (signupStep) {
      case 0:
        setSignupStep(1);
        break;
      case 1:
        await handleCreateWallet();
        break;
      case 3:
        setSignupStep(4);
        break;
      case 4:
        await completeSetup();
        break;
    }
  }, [signupStep, handleCreateWallet, completeSetup, setSignupStep]);

  /**
   * Go back one wizard step.
   * Step 0 → cancel, Step 1 → step 0. Steps 2+ are handled by their own components.
   */
  const handleBack = useCallback(() => {
    if (signupStep === 0) {
      cancelSetup();
    } else if (signupStep === 1) {
      setSignupStep(0);
    }
  }, [signupStep, cancelSetup, setSignupStep]);

  const enabledCount = Object.values(state.enabledAdapters).filter(
    Boolean,
  ).length;
  const emailValid =
    !state.enabledAdapters.email ||
    (!!state.adapterFields.email && state.adapterFields.email.includes('@'));

  /** Whether the wizard's primary Next button should be disabled. */
  const isNextDisabled =
    signupStep === 0
      ? !state.password ||
        !state.confirmPassword ||
        state.password !== state.confirmPassword ||
        state.password.length < 12 ||
        state.isCreating
      : signupStep === 1
        ? enabledCount < MIN_SHARES || !emailValid || state.isCreating
        : signupStep === 4
          ? !isDisclaimerReady
          : false;

  const setDisclaimerReady = useCallback(() => {
    setIsDisclaimerReady(true);
  }, []);

  return {
    ...state,
    biometricAvailable,
    signupStep,
    setSignupStep,
    setPassword,
    setConfirmPassword,
    setAdapterField,
    toggleAdapter,
    setThreshold,
    updateDistributionStatus,
    handleCreateWallet,
    completeSetup,
    cancelSetup,
    advance,
    handleBack,
    isNextDisabled,
    setDisclaimerReady,
  };
}

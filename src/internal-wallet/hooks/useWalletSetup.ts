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

/**
 * Translation key suffixes for each wizard step (prefixed with `jumperWallet.` in the UI).
 * Step 1 (biometric) is always present; it is skipped automatically when WebAuthn is unavailable.
 */
export const SIGNUP_STEPS = [
  'signup.createPassword',
  'signup.biometricSetup',
  'signup.recoverySetup',
  'signup.distributing',
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
  /** Live distribution status per adapter (populated during step 2) */
  distribution: ShareDistributionEntry[];
}

const DEFAULT_ENABLED_ADAPTERS: Record<ShareStorageType, boolean> = {
  localStorage: true,
  email: false,
  googleDrive: false,
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
};

export function useWalletSetup() {
  const [state, setState] = useState<SetupState>(initialState);
  const [prfAvailable, setPrfAvailable] = useState(false);

  useEffect(() => {
    if (webAuthnAvailable) {
      isPRFSupported().then(setPrfAvailable);
    }
  }, []);

  const biometricAvailable = webAuthnAvailable && prfAvailable;
  const signupStep = useJumperWalletStore((s) => s.signupStep);
  const setSignupStep = useJumperWalletStore((s) => s.setSignupStep);
  const createWallet = useJumperWalletStore((s) => s.createWallet);
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
      setState((prev) => ({
        ...prev,
        enabledAdapters: { ...prev.enabledAdapters, [type]: enabled },
      }));
    },
    [],
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
   * Step 0 → Step 1: Create the wallet with the password.
   * Generates mnemonic, encrypts, splits into shares.
   */
  const handleCreateWallet = useCallback(async () => {
    if (state.password !== state.confirmPassword) {
      setState((prev) => ({
        ...prev,
        error: 'Passwords do not match',
      }));
      return false;
    }

    setState((prev) => ({ ...prev, isCreating: true, error: null }));

    try {
      const result = await createWallet(state.password);
      setState((prev) => ({
        ...prev,
        shares: result.shares,
        address: result.address,
        isCreating: false,
      }));
      setSignupStep(biometricAvailable ? 1 : 2);
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
    state.password,
    state.confirmPassword,
    biometricAvailable,
    createWallet,
    setSignupStep,
  ]);

  /**
   * Initialize the distribution entries based on enabled adapters.
   * Called when moving from step 1 (setup) to step 2 (distribution).
   */
  const initDistribution = useCallback(() => {
    const enabled = (
      Object.entries(state.enabledAdapters) as [ShareStorageType, boolean][]
    )
      .filter(([, v]) => v)
      .map(([type]): ShareDistributionEntry => ({ type, status: 'idle' }));

    setState((prev) => ({ ...prev, distribution: enabled }));
  }, [state.enabledAdapters]);

  /**
   * Complete the sign-up flow.
   * Resolves the pending connect request so the wagmi connector connects.
   */
  const completeSetup = useCallback(async () => {
    // Persist which share types were successfully stored
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
   * Handles per-step side-effects (wallet creation, distribution init, completion).
   */
  const advance = useCallback(async () => {
    switch (signupStep) {
      case 0:
        await handleCreateWallet();
        break;
      case 2:
        initDistribution();
        setSignupStep(3);
        break;
      case 3:
        await completeSetup();
        break;
    }
  }, [
    signupStep,
    handleCreateWallet,
    initDistribution,
    completeSetup,
    setSignupStep,
  ]);

  /**
   * Go back one wizard step.
   * When WebAuthn is unavailable step 1 was never shown, so back from step 2 returns to step 0.
   */
  const handleBack = useCallback(() => {
    if (signupStep === 0) {
      cancelSetup();
    } else if (signupStep === 2 && !biometricAvailable) {
      setSignupStep(0);
    } else {
      setSignupStep(signupStep - 1);
    }
  }, [signupStep, biometricAvailable, cancelSetup, setSignupStep]);

  /** Whether the wizard's primary Next button should be disabled. */
  const isNextDisabled =
    signupStep === 0 &&
    (!state.password ||
      !state.confirmPassword ||
      state.password !== state.confirmPassword ||
      state.password.length < 12 ||
      state.isCreating);

  return {
    ...state,
    biometricAvailable,
    signupStep,
    setSignupStep,
    setPassword,
    setConfirmPassword,
    setAdapterField,
    toggleAdapter,
    updateDistributionStatus,
    initDistribution,
    handleCreateWallet,
    completeSetup,
    cancelSetup,
    advance,
    handleBack,
    isNextDisabled,
  };
}

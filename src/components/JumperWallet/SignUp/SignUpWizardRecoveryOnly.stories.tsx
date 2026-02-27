/**
 * End-to-end demo of the share distribution + recovery round-trip.
 *
 * 1. Generates a real wallet on mount and displays the first 6 mnemonic words
 *    in a banner — this is the "secret" to verify against.
 * 2. Walks through recovery setup → share distribution (real Shamir shares).
 * 3. The RecoveryCollectionStep auto-queries device-stored shares and shows
 *    manual input fields for shares that require pasting.
 * 4. Verifies the recovered first-6 words match the original (color-coded
 *    against the banner above).
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ButtonPrimary,
  ButtonTransparent,
} from '@/components/Button/Button.style';
import type {
  ShamirShare,
  ShareStorageType,
} from '@/internal-wallet/crypto/types';
import type {
  ShareDistributionEntry,
  ShareDistributionStatus,
} from '@/internal-wallet/hooks/useWalletSetup';
import type {
  AdapterFields,
  AdaptersWithFields,
} from '@/internal-wallet/recovery/adapters/ShareStorageAdapter.types';
import {
  generateWallet,
  entropyToMnemonicPhrase,
} from '@/internal-wallet/crypto/mnemonic';
import { splitEntropy, combineShares } from '@/internal-wallet/crypto/shamir';
import { RecoverySetupStep } from './steps/RecoverySetupStep';
import { RecoveryDistributionStep } from './steps/RecoveryDistributionStep';
import {
  RecoveryCollectionStep,
  parseRawShare,
  type RecoveryCollectionEntry,
  type ShareCollectionStatus,
} from '../Recovery/RecoveryCollectionStep';
import {
  ButtonRow,
  WizardContainer,
  WizardTitle,
  WizardSubtitle,
  StepContent,
} from './SignUpWizard.style';
import {
  withMockJumperWalletStore,
  withMockModalContainer,
} from '../__stories__/decorators';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEP_LABELS = [
  'Recovery Setup',
  'Distribute Shares',
  'Recover Secret',
  'Verify',
];
const REFERENCE_WORD_COUNT = 6;

const RECOVERY_CONFIG = { totalShares: 4, threshold: 2 } as const;

const DEFAULT_ENABLED_ADAPTERS: Record<ShareStorageType, boolean> = {
  localStorage: true,
  email: false,
  googleDrive: false,
  recoveryCode: true,
};

/* ------------------------------------------------------------------ */
/*  Demo component                                                     */
/* ------------------------------------------------------------------ */

function RecoveryRoundtripDemo() {
  const { t } = useTranslation();

  // --- Wallet generation (runs once on mount) ---
  const [originalMnemonic, setOriginalMnemonic] = useState('');
  const [shares, setShares] = useState<ShamirShare[]>([]);
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(
    null,
  );
  const [ready, setReady] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      const wallet = generateWallet();
      const shamirShares = await splitEntropy(
        wallet.entropy,
        wallet.address,
        RECOVERY_CONFIG,
      );
      setOriginalMnemonic(wallet.mnemonic);
      setWalletAddress(wallet.address);
      setShares(shamirShares);
      setReady(true);
    })();
  }, []);

  // --- Step management ---
  const [step, setStep] = useState(0);

  // Step 0: Recovery Setup
  const [enabledAdapters, setEnabledAdapters] = useState(
    DEFAULT_ENABLED_ADAPTERS,
  );
  const [adapterFields, setAdapterFields] = useState<Partial<AdapterFields>>(
    {},
  );
  const setAdapterField = useCallback(
    <K extends AdaptersWithFields>(type: K, value: AdapterFields[K]) => {
      setAdapterFields((prev) => ({ ...prev, [type]: value }));
    },
    [],
  );
  const toggleAdapter = useCallback(
    (type: ShareStorageType, enabled: boolean) => {
      setEnabledAdapters((prev) => ({ ...prev, [type]: enabled }));
    },
    [],
  );

  // Step 1: Distribution
  const [distribution, setDistribution] = useState<ShareDistributionEntry[]>(
    [],
  );
  const updateDistributionStatus = useCallback(
    (
      type: ShareStorageType,
      status: ShareDistributionStatus,
      error?: string,
    ) => {
      setDistribution((prev) =>
        prev.map((d) => (d.type === type ? { ...d, status, error } : d)),
      );
    },
    [],
  );

  // Step 2: Collection
  const [collectionEntries, setCollectionEntries] = useState<
    RecoveryCollectionEntry[]
  >([]);
  const [autoShares, setAutoShares] = useState<ShamirShare[]>([]);

  const handleCollectionStatusChange = useCallback(
    (
      type: ShareStorageType,
      status: ShareCollectionStatus,
      share?: ShamirShare,
      error?: string,
    ) => {
      setCollectionEntries((prev) =>
        prev.map((e) => (e.type === type ? { ...e, status, error } : e)),
      );
      if (share) setAutoShares((prev) => [...prev, share]);
    },
    [],
  );

  const handleManualInput = useCallback(
    (type: ShareStorageType, value: string) => {
      setCollectionEntries((prev) =>
        prev.map((e) => (e.type === type ? { ...e, manualValue: value } : e)),
      );
    },
    [],
  );

  // Step 3: Verification
  const [recoveredMnemonic, setRecoveredMnemonic] = useState<string | null>(
    null,
  );
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // --- Derived values ---
  const originalWords = originalMnemonic
    ? originalMnemonic.split(' ').slice(0, REFERENCE_WORD_COUNT)
    : [];
  const recoveredWords = recoveredMnemonic
    ? recoveredMnemonic.split(' ').slice(0, REFERENCE_WORD_COUNT)
    : [];
  const isMatch =
    recoveredMnemonic !== null &&
    originalWords.join(' ') === recoveredWords.join(' ');

  // --- Handlers ---
  const handleRecover = useCallback(async () => {
    setIsRecovering(true);
    setRecoveryError(null);

    try {
      const allShares: ShamirShare[] = [...autoShares];
      for (const entry of collectionEntries) {
        const raw = (entry.manualValue ?? '').trim();
        if (raw) allShares.push(parseRawShare(raw, RECOVERY_CONFIG));
      }

      if (allShares.length < RECOVERY_CONFIG.threshold) {
        throw new Error(
          `Need at least ${RECOVERY_CONFIG.threshold} shares to reconstruct.`,
        );
      }

      const { entropy } = await combineShares(allShares);
      setRecoveredMnemonic(entropyToMnemonicPhrase(entropy));
      setStep(3);
    } catch (err) {
      setRecoveryError(err instanceof Error ? err.message : 'Recovery failed');
    } finally {
      setIsRecovering(false);
    }
  }, [autoShares, collectionEntries]);

  const handleNext = async () => {
    switch (step) {
      case 0: {
        const entries = (
          Object.entries(enabledAdapters) as [ShareStorageType, boolean][]
        )
          .filter(([, v]) => v)
          .map(([type]): ShareDistributionEntry => ({ type, status: 'idle' }));
        setDistribution(entries);
        setStep(1);
        break;
      }
      case 1:
        setCollectionEntries(
          distribution.map((d) => ({ type: d.type, status: 'idle' as const })),
        );
        setAutoShares([]);
        setRecoveryError(null);
        setStep(2);
        break;
      case 2:
        await handleRecover();
        break;
      case 3:
        setStep(0);
        setRecoveredMnemonic(null);
        setRecoveryError(null);
        break;
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep(step - 1);
    if (step === 3) setRecoveredMnemonic(null);
  };

  // --- Step renderers ---
  const renderSetup = () => (
    <RecoverySetupStep
      enabledAdapters={enabledAdapters}
      adapterFields={adapterFields}
      onToggleAdapter={toggleAdapter}
      onAdapterFieldChange={setAdapterField}
    />
  );

  const renderDistribution = () => (
    <RecoveryDistributionStep
      shares={shares}
      address={walletAddress}
      distribution={distribution}
      adapterFields={adapterFields}
      onStatusChange={updateDistributionStatus}
    />
  );

  const renderCollection = () => (
    <>
      <RecoveryCollectionStep
        entries={collectionEntries}
        walletAddress={walletAddress ?? ''}
        shamirConfig={RECOVERY_CONFIG}
        onStatusChange={handleCollectionStatusChange}
        onManualInput={handleManualInput}
      />
      {recoveryError && <Alert severity="error">{recoveryError}</Alert>}
    </>
  );

  const renderVerify = () => (
    <StepContent>
      <Typography variant="subtitle1" fontWeight={600}>
        Verification
      </Typography>

      <Alert severity={isMatch ? 'success' : 'error'}>
        {isMatch
          ? '✓ Recovery successful — the recovered words match the original.'
          : '✗ Mismatch — the recovered words do NOT match the original.'}
      </Alert>

      {/* Original words are in the banner above; show only the recovered set here. */}
      <Box>
        <Typography
          variant="caption"
          fontWeight={600}
          display="block"
          gutterBottom
        >
          Recovered (first {REFERENCE_WORD_COUNT} words):
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {recoveredWords.map((word, i) => (
            <Chip
              key={i}
              label={`${i + 1}. ${word}`}
              size="small"
              color={word === originalWords[i] ? 'success' : 'error'}
            />
          ))}
        </Box>
      </Box>
    </StepContent>
  );

  // --- Loading ---
  if (!ready) {
    return (
      <WizardContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </WizardContainer>
    );
  }

  return (
    <WizardContainer>
      {/* ── Original secret banner (always visible) ── */}
      <Alert severity="info">
        <Typography
          variant="caption"
          fontWeight={600}
          display="block"
          gutterBottom
        >
          Original secret — first {REFERENCE_WORD_COUNT} words (story only):
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {originalWords.map((word, i) => (
            <Chip
              key={i}
              label={`${i + 1}. ${word}`}
              size="small"
              color="primary"
            />
          ))}
        </Box>
      </Alert>

      <WizardTitle>Recovery Round-trip Demo</WizardTitle>
      <WizardSubtitle>
        Distribute shares then recover to verify the secret matches.
      </WizardSubtitle>

      <Stepper activeStep={step} alternativeLabel>
        {STEP_LABELS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && renderSetup()}
      {step === 1 && renderDistribution()}
      {step === 2 && renderCollection()}
      {step === 3 && renderVerify()}

      <ButtonRow>
        <ButtonTransparent onClick={handleBack} disabled={step === 0}>
          {t('jumperWallet.signup.back')}
        </ButtonTransparent>
        <ButtonPrimary
          onClick={handleNext}
          disabled={isRecovering}
          startIcon={isRecovering ? <CircularProgress size={16} /> : undefined}
        >
          {step === 2
            ? 'Recover'
            : step === 3
              ? 'Start Over'
              : t('jumperWallet.signup.continue')}
        </ButtonPrimary>
      </ButtonRow>
    </WizardContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Storybook meta                                                     */
/* ------------------------------------------------------------------ */

const meta = {
  title: 'JumperWallet/Recovery/RoundtripDemo',
  component: RecoveryRoundtripDemo,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    withMockModalContainer,
    withMockJumperWalletStore({
      flow: 'signup',
      shamirConfig: RECOVERY_CONFIG,
    }),
  ],
} satisfies Meta<typeof RecoveryRoundtripDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Full round-trip demo:
 * 1. The banner at the top shows the first 6 words of a freshly generated wallet.
 * 2. Configure adapters → Continue → shares are distributed (device keychain + recovery code by default).
 * 3. Continue → RecoveryCollectionStep auto-queries device-stored shares and shows manual input
 *    fields for the recovery-code share → Recover.
 * 4. The Verify step shows the recovered words color-coded against the banner above.
 */
export const Default: Story = {};

'use client';

import { Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import {
  ButtonPrimary,
  ButtonTransparent,
} from '@/components/Button/Button.style';
import { useTranslation } from 'react-i18next';
import {
  useWalletSetup,
  SIGNUP_STEPS,
} from '@/internal-wallet/hooks/useWalletSetup';
import { useJumperWalletStore } from '@/stores/jumperWallet/JumperWalletStore';
import { BiometricSetupStep } from './steps/BiometricSetupStep';
import { CreatePasswordStep } from './steps/CreatePasswordStep';
import { RecoverySetupStep } from './steps/RecoverySetupStep';
import { RecoveryDistributionStep } from './steps/RecoveryDistributionStep';
import { RecoveryDisclaimerStep } from './steps/RecoveryDisclaimerStep';
import {
  ButtonRow,
  WizardContainer,
  WizardSubtitle,
  WizardTitle,
} from './SignUpWizard.style';

export function SignUpWizard() {
  const { t } = useTranslation();
  const setup = useWalletSetup();
  const setFlow = useJumperWalletStore((s) => s.setFlow);

  const renderStep = () => {
    switch (setup.signupStep) {
      case 0:
        return (
          <CreatePasswordStep
            password={setup.password}
            confirmPassword={setup.confirmPassword}
            onPasswordChange={setup.setPassword}
            onConfirmPasswordChange={setup.setConfirmPassword}
            error={setup.error}
          />
        );
      case 1:
        return (
          <RecoverySetupStep
            enabledAdapters={setup.enabledAdapters}
            adapterFields={setup.adapterFields}
            threshold={setup.threshold}
            onToggleAdapter={setup.toggleAdapter}
            onAdapterFieldChange={setup.setAdapterField}
            onThresholdChange={setup.setThreshold}
          />
        );
      case 2:
        return (
          <BiometricSetupStep
            password={setup.password}
            onComplete={() => setup.setSignupStep(3)}
          />
        );
      case 3:
        return (
          <RecoveryDistributionStep
            shares={setup.shares}
            address={setup.address}
            distribution={setup.distribution}
            adapterFields={setup.adapterFields}
            onStatusChange={setup.updateDistributionStatus}
          />
        );
      case 4:
        return (
          <RecoveryDisclaimerStep
            threshold={setup.threshold}
            onReady={setup.setDisclaimerReady}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardContainer>
      <WizardTitle>{t('jumperWallet.signup.title')}</WizardTitle>
      <WizardSubtitle>{t('jumperWallet.signup.subtitle')}</WizardSubtitle>

      {setup.signupStep > 0 && (
        <Stepper activeStep={setup.signupStep} alternativeLabel>
          {SIGNUP_STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{t(`jumperWallet.${label}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {renderStep()}

      {/* BiometricSetupStep (step 2) provides its own Enable / Skip buttons */}
      {setup.signupStep !== 2 && (
        <ButtonRow>
          {setup.signupStep < 3 && (
            <ButtonTransparent
              onClick={
                setup.signupStep === 0
                  ? () => setFlow('recovery')
                  : setup.handleBack
              }
            >
              {setup.signupStep === 0
                ? t('jumperWallet.signup.loginInstead')
                : t('jumperWallet.signup.back')}
            </ButtonTransparent>
          )}
          <ButtonPrimary
            onClick={setup.advance}
            disabled={setup.isNextDisabled}
            startIcon={
              setup.isCreating ? <CircularProgress size={16} /> : undefined
            }
          >
            {setup.signupStep === 4
              ? t('jumperWallet.signup.disclaimerAcknowledge')
              : t('jumperWallet.signup.continue')}
          </ButtonPrimary>
        </ButtonRow>
      )}
    </WizardContainer>
  );
}

import { useMemo } from 'react';
import { AvailableSteps, BaseStepperProps } from '../ClaimPerkModal.types';
import { useTranslation } from 'react-i18next';

export const STEP_ORDER: AvailableSteps[] = [
  AvailableSteps.Username,
  AvailableSteps.Email,
  AvailableSteps.Wallet,
];

export interface StepConfig {
  id: string;
  title: string;
  stepProps: Record<string, any>;
}

export const useClaimPerkSteps = ({
  permittedSteps,
  stepProps,
}: BaseStepperProps) => {
  const { t } = useTranslation();
  const availableSteps = useMemo(
    () =>
      ({
        [AvailableSteps.Username]: {
          title: t('modal.perks.stepper.steps.username.title'),
          id: 'username',
        },
        [AvailableSteps.Email]: {
          title: t('modal.perks.stepper.steps.email.title'),
          id: 'email',
        },
        [AvailableSteps.Wallet]: {
          title: t('modal.perks.stepper.steps.wallet.title'),
          id: 'wallet',
        },
      }) as const,
    [t],
  );

  const steps = useMemo(
    () =>
      STEP_ORDER.filter((step) => permittedSteps.includes(step)).map(
        (step) => ({
          ...availableSteps[step],
          stepProps: stepProps?.[step] ?? {
            usernameType: 'Discord',
          },
        }),
      ),
    [permittedSteps, stepProps, availableSteps],
  );

  return steps;
};

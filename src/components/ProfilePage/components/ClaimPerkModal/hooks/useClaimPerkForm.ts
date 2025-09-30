import { useCallback, useMemo, useState } from 'react';
import { BaseStepperProps } from '../ClaimPerkModal.types';
import { buildFormSchema } from '../validation/schemas';
import { isHex } from 'viem';
import { useSignMessage } from 'src/hooks/useSignMessage';
import { STEP_ORDER } from './useClaimPerkSteps';
import {
  PerkClaimStatus,
  usePerkClaimStatusStore,
} from 'src/stores/perkClaimStatus';

export interface FormState {
  values: Record<string, string>;
  activeStep: number;
  showError: boolean;
  isSubmitting: boolean;
  isError: boolean;
}

export interface FormActions {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleContinue: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setActiveStep: (step: number) => void;
  resetForm: () => void;
}

export interface FormValidation {
  isCurrentStepValid: boolean;
  currentStepError: string;
  isFormValid: boolean;
}

const PERK_CLAIM_MESSAGE = 'Claiming perk on jumper.exchange';

export const useClaimPerkForm = ({
  perkId,
  permittedSteps,
  onClaim,
}: BaseStepperProps & { perkId: string }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mutationStatus = usePerkClaimStatusStore((state) =>
    state.getStatus(perkId),
  );
  console.log('mutationStatus', mutationStatus);

  const { signMessageAsync, isError } = useSignMessage();

  const schema = useMemo(
    () => buildFormSchema(permittedSteps),
    [permittedSteps],
  );

  const steps = useMemo(
    () => STEP_ORDER.filter((step) => permittedSteps.includes(step)),
    [permittedSteps],
  );

  const isLastStep = activeStep === steps.length - 1;
  const currentStepId = steps[activeStep];

  const currentStepValidation = useMemo(() => {
    if (!currentStepId) return null;
    const currentStepValue = formValues[currentStepId] ?? '';
    const currentStepSchema = schema.shape[currentStepId];
    return currentStepSchema
      ? currentStepSchema.safeParse(currentStepValue)
      : null;
  }, [formValues, schema, currentStepId]);

  const isCurrentStepValid = currentStepValidation?.success ?? false;
  const isFormValid = schema.safeParse(formValues).success;

  const currentStepError = useMemo(() => {
    if (!currentStepValidation || currentStepValidation.success) return '';
    return currentStepValidation.error.errors[0]?.message || 'Invalid input';
  }, [currentStepValidation]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowError(false);
      setFormValues((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    },
    [],
  );

  const handleContinue = useCallback(() => {
    if (isLastStep) return;
    if (!isCurrentStepValid) {
      setShowError(true);
      return;
    }
    setActiveStep(activeStep + 1);
  }, [activeStep, isCurrentStepValid, isLastStep]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const result = schema.safeParse(formValues);
      setIsSubmitting(true);

      if (!result.success) {
        console.error('Validation failed', result.error.format());
        setIsSubmitting(false);
        return;
      }

      try {
        const signature = await signMessageAsync({
          message: PERK_CLAIM_MESSAGE,
          walletAddress: result.data.wallet,
          walletType: result.data.walletType,
        });

        const values = {
          ...formValues,
          signature,
          message: PERK_CLAIM_MESSAGE,
        };

        onClaim(values);
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [schema, formValues, signMessageAsync, onClaim],
  );

  const resetForm = useCallback(() => {
    setFormValues({});
    setActiveStep(0);
    setShowError(false);
    setIsSubmitting(false);
  }, []);

  const formState: FormState = {
    values: formValues,
    activeStep,
    showError,
    isSubmitting: isSubmitting || mutationStatus === PerkClaimStatus.Pending,
    // @Note need to ask design about the BE error state
    isError: isError /*|| mutationStatus === PerkClaimStatus.Error*/,
  };

  const formActions: FormActions = {
    handleChange,
    handleContinue,
    handleSubmit,
    setActiveStep,
    resetForm,
  };

  const formValidation: FormValidation = {
    isCurrentStepValid,
    currentStepError,
    isFormValid,
  };

  return {
    ...formState,
    ...formActions,
    ...formValidation,
    currentStepId,
    isLastStep,
    steps,
  };
};

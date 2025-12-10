import { useCallback, useEffect, useMemo, useState } from 'react';
import { BaseStepperProps } from '../ClaimPerkModal.types';
import { buildFormSchema } from '../validation/schemas';
import { SignMessageErrorType, useSignMessage } from 'src/hooks/useSignMessage';
import { STEP_ORDER } from './useClaimPerkSteps';
import { usePerkClaimStatus } from 'src/hooks/perks/usePerkClaimStatus';

export enum ErrorType {
  SignatureFailed = 'signatureFailed',
  ValidationFailed = 'validationFailed',
  UnsupportedWallet = 'unsupportedWallet',
  Unknown = 'unknown',
}

export interface FormState {
  values: Record<string, string>;
  activeStep: number;
  showStepError: boolean;
  isSubmitting: boolean;
  isError: boolean;
  errorType: ErrorType;
}

export interface FormActions {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleContinue: () => void;
  handleBack: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setActiveStep: (step: number) => void;
  resetForm: () => void;
  handleCloseErrorBottomSheet: () => void;
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
  const [showStepError, setShowStepError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mutationStatus = usePerkClaimStatus(perkId, formValues.wallet);
  const [showErrorBottomSheet, setShowErrorBottomSheet] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.Unknown);

  const {
    signMessageAsync,
    isPending: isSignMessagePending,
    isError: isSignMessageError,
    errorType: signMessageErrorType,
  } = useSignMessage();

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
    return currentStepValidation.error.issues[0]?.message || 'Invalid input';
  }, [currentStepValidation]);

  useEffect(() => {
    if (!isSignMessageError && !mutationStatus.isError) {
      return;
    }

    setShowErrorBottomSheet(true);

    if (mutationStatus.isError) {
      setErrorType(ErrorType.Unknown);
    }

    if (isSignMessageError) {
      if (signMessageErrorType === SignMessageErrorType.UnsupportedWallet) {
        setErrorType(ErrorType.UnsupportedWallet);
      } else {
        setErrorType(ErrorType.SignatureFailed);
      }
    }
  }, [isSubmitting, isSignMessageError, signMessageErrorType, mutationStatus]);

  const handleCloseErrorBottomSheet = useCallback(() => {
    setShowErrorBottomSheet(false);
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowStepError(false);
      setFormValues((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    },
    [],
  );

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  const handleContinue = useCallback(() => {
    if (isLastStep) return;
    if (!isCurrentStepValid) {
      setShowStepError(true);
      return;
    }
    setActiveStep(activeStep + 1);
  }, [activeStep, isCurrentStepValid, isLastStep]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setShowErrorBottomSheet(false);
      mutationStatus.resetStatus();
      const result = schema.safeParse(formValues);

      if (!result.success) {
        console.error('Validation failed', result.error.format());
        setIsSubmitting(false);
        setShowErrorBottomSheet(true);
        setErrorType(ErrorType.ValidationFailed);
        return;
      }

      try {
        const signature = await signMessageAsync({
          message: PERK_CLAIM_MESSAGE,
          walletAddress: formValues.wallet,
          walletType: formValues.walletType,
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
    setShowStepError(false);
    setIsSubmitting(false);
  }, []);

  const formState: FormState = {
    values: formValues,
    activeStep,
    showStepError,
    isSubmitting:
      isSubmitting || isSignMessagePending || mutationStatus.isPending,
    isError: showErrorBottomSheet,
    errorType,
  };

  const formActions: FormActions = {
    handleChange,
    handleContinue,
    handleBack,
    handleSubmit,
    setActiveStep,
    resetForm,
    handleCloseErrorBottomSheet,
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

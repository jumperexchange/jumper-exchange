import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { StepIcon } from '../StepIcon';
import { BaseStepperProps } from '../../ClaimPerkModal.types';
import { StepContentFactory } from '../StepContent/StepContentFactory';
import {
  StyledActiveStepContentContainer,
  StyledModalSectionContainer,
  StyledModalSectionHeaderContainer,
  StyledMultiStepTitleContainer,
  StyledStep,
  StyledStepper,
  StyledTitleContainer,
  StyledTitleIconButton,
} from '../../ClaimPerkModal.styles';
import { useClaimPerkForm } from '../../hooks/useClaimPerkForm';
import { useClaimPerkSteps } from '../../hooks/useClaimPerkSteps';
import { StatusBottomSheet } from '../StatusBottomSheet/StatusBottomSheet';
import { MODAL_CONTAINER_ID } from '../../constants';
import { useStatusSheetContent } from '../../hooks/useStatusSheetContent';

interface StepperContentProps extends BaseStepperProps {
  perkId: string;
}

export const StepperContent: FC<StepperContentProps> = (props) => {
  const { t } = useTranslation();
  const steps = useClaimPerkSteps(props);
  const {
    values,
    activeStep,
    showStepError,
    currentStepError,
    isSubmitting,
    currentStepId,
    isError,
    errorType,
    handleBack,
    handleChange,
    handleContinue,
    handleSubmit,
    handleCloseErrorBottomSheet,
  } = useClaimPerkForm(props);
  const bottomSheetProps = useStatusSheetContent(
    errorType,
    handleCloseErrorBottomSheet,
  );

  const currentStep = activeStep + 1;
  const totalSteps = steps.length;

  const activeStepContent = steps[activeStep] ?? {};
  const isMultiStep = steps.length > 1;
  const showBackButton = isMultiStep && activeStep > 0;
  const TitleContainer = isMultiStep
    ? StyledMultiStepTitleContainer
    : StyledTitleContainer;

  return (
    <form id={MODAL_CONTAINER_ID} onSubmit={handleSubmit}>
      <StyledModalSectionContainer
        sx={(theme) => ({
          gap: isMultiStep ? theme.spacing(5) : theme.spacing(3),
        })}
      >
        <StyledModalSectionHeaderContainer>
          <TitleContainer>
            {showBackButton && (
              <StyledTitleIconButton
                disabled={isSubmitting}
                size="small"
                onClick={handleBack}
              >
                <ChevronLeftIcon />
              </StyledTitleIconButton>
            )}
            <Typography variant="titleSmall">
              {t('modal.perks.unclaimedPerk.title')}
            </Typography>
          </TitleContainer>
          {isMultiStep && (
            <StyledStepper activeStep={activeStep} alternativeLabel>
              {steps.map((step) => (
                <StyledStep key={step.title}>
                  <StepLabel slots={{ stepIcon: StepIcon }}>
                    {step.title}
                  </StepLabel>
                </StyledStep>
              ))}
            </StyledStepper>
          )}
        </StyledModalSectionHeaderContainer>

        <StyledActiveStepContentContainer>
          <StepContentFactory
            stepType={currentStepId as any}
            stepId={activeStepContent.id}
            value={values[activeStepContent.id] ?? ''}
            onChange={handleChange}
            onContinue={handleContinue}
            errorMessage={showStepError ? currentStepError : ''}
            isSubmitting={isSubmitting}
            stepProps={activeStepContent.stepProps}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </StyledActiveStepContentContainer>
      </StyledModalSectionContainer>
      <StatusBottomSheet
        {...bottomSheetProps}
        containerId={MODAL_CONTAINER_ID}
        isOpen={isError}
      />
    </form>
  );
};

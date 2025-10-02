import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { StepIcon } from '../StepIcon';
import { BaseStepperProps } from '../../ClaimPerkModal.types';
import { StepContentFactory } from '../StepContent/StepContentFactory';
import {
  StyledActiveStepContentContainer,
  StyledModalSectionContainer,
  StyledModalSectionHeaderContainer,
  StyledStepper,
  StyledTitleContainer,
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
    handleChange,
    handleContinue,
    handleSubmit,
    handleCloseErrorBottomSheet,
  } = useClaimPerkForm(props);
  const bottomSheetProps = useStatusSheetContent(
    errorType,
    handleCloseErrorBottomSheet,
  );

  const activeStepContent = steps[activeStep];
  const isMultiStep = steps.length > 1;

  return (
    <form id={MODAL_CONTAINER_ID} onSubmit={handleSubmit}>
      <StyledModalSectionContainer
        sx={(theme) => ({
          gap: isMultiStep ? theme.spacing(5) : theme.spacing(3),
        })}
      >
        <StyledModalSectionHeaderContainer>
          <StyledTitleContainer>
            <Typography variant="titleSmall">
              {t('modal.perks.unclaimedPerk.title')}
            </Typography>
          </StyledTitleContainer>
          {isMultiStep && (
            <StyledStepper activeStep={activeStep} alternativeLabel>
              {steps.map((step) => (
                <Step key={step.title}>
                  <StepLabel slots={{ stepIcon: StepIcon }}>
                    {step.title}
                  </StepLabel>
                </Step>
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
            isMultiStep={isMultiStep}
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

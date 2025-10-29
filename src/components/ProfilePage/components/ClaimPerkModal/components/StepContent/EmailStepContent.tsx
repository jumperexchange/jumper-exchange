import { FC } from 'react';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { TaskInput } from 'src/components/Form/TaskInput/TaskInput';

import { Button } from 'src/components/Button/Button';
import { useTranslation } from 'react-i18next';
import { getStepPositionKey } from '../../utils';

interface EmailStepContentProps {
  value: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  errorMessage?: string;
  currentStep: number;
  totalSteps: number;
}

export const EmailStepContent: FC<EmailStepContentProps> = ({
  errorMessage,
  value,
  id,
  onChange,
  onContinue,
  currentStep,
  totalSteps,
}) => {
  const isDisabled = errorMessage !== '';
  const { t } = useTranslation();
  const positionKey = getStepPositionKey(currentStep, totalSteps);

  return (
    <>
      <Typography variant="bodyMedium" color="textSecondary">
        {t('modal.perks.stepper.steps.email.description', {
          position: t(`modal.perks.stepper.steps.position.${positionKey}`),
          count: currentStep,
        })}
      </Typography>
      <FormControl key={id} sx={{ width: '100%' }}>
        <TaskInput
          placeholder={`email@example.com`}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      </FormControl>
      <Button
        fullWidth
        disabled={isDisabled}
        onClick={onContinue}
        variant={isDisabled ? 'transparent' : 'primary'}
        type={'button'}
        styles={{
          marginTop: 4,
        }}
      >
        {t('modal.perks.stepper.continue')}
      </Button>
    </>
  );
};

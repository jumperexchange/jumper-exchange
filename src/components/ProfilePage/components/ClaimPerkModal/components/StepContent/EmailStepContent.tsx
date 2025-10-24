import { FC } from 'react';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { TaskInput } from 'src/components/Form/TaskInput/TaskInput';

import { capitalizeString } from 'src/utils/capitalizeString';
import { Button } from 'src/components/Button/Button';
import { useTranslation } from 'react-i18next';

interface EmailStepContentProps {
  value: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  errorMessage?: string;
  position: string;
  positionIndex: number;
}

export const EmailStepContent: FC<EmailStepContentProps> = ({
  errorMessage,
  value,
  id,
  onChange,
  onContinue,
  position,
  positionIndex,
}) => {
  const isDisabled = errorMessage !== '';
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="bodyMedium" color="textSecondary">
        {t('modal.perks.stepper.steps.email.description', {
          position,
          count: positionIndex + 1,
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

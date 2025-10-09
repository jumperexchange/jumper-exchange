import { FC } from 'react';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { TaskInput } from 'src/components/Form/TaskInput/TaskInput';

import { capitalizeString } from 'src/utils/capitalizeString';
import { Button } from 'src/components/Button/Button';
import { useTranslation } from 'react-i18next';

interface UsernameStepContentProps {
  usernameType: string;
  value: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  errorMessage?: string;
}

export const UsernameStepContent: FC<UsernameStepContentProps> = ({
  errorMessage,
  usernameType,
  value,
  id,
  onChange,
  onContinue,
}) => {
  const isDisabled = errorMessage !== '';
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="bodyMedium" color="textSecondary">
        {t('modal.perks.stepper.multipleSteps.username.description', {
          usernameType: capitalizeString(usernameType),
        })}
      </Typography>
      <FormControl key={id} sx={{ width: '100%' }}>
        <TaskInput
          placeholder={`@username`}
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

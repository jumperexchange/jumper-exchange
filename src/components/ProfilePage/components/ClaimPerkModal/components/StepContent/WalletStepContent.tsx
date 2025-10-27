import { useAccount } from '@lifi/wallet-management';
import Typography from '@mui/material/Typography';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { Button } from 'src/components/Button/Button';
import { walletDigest } from 'src/utils/walletDigest';
import { getStepPositionKey } from '../../utils';

interface WalletStepContentProps {
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  currentStep: number;
  totalSteps: number;
}

export const WalletStepContent: FC<WalletStepContentProps> = ({
  value,
  onChange,
  isSubmitting,
  currentStep,
  totalSteps,
}) => {
  const { account } = useAccount();
  const { t } = useTranslation();
  const positionKey = getStepPositionKey(currentStep, totalSteps);

  useEffect(() => {
    if (!account?.address || !onChange) {
      return;
    }
    onChange({
      target: { name: 'wallet', value: account?.address },
    } as React.ChangeEvent<HTMLInputElement>);
    onChange({
      target: { name: 'walletType', value: account?.chainType },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [onChange, account?.address, account?.chainType]);

  return (
    <>
      <Typography variant="bodyMedium" color="textSecondary">
        {t(`modal.perks.stepper.steps.wallet.description`, {
          position: t(`modal.perks.stepper.steps.position.${positionKey}`),
          count: currentStep,
        })}
      </Typography>
      <Badge
        variant={BadgeVariant.Alpha}
        size={BadgeSize.XL}
        label={walletDigest(value ? value : account?.address)}
        sx={{ width: '100%' }}
      />
      <Button
        fullWidth
        variant={isSubmitting ? 'transparent' : 'primary'}
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingPosition="start"
        styles={{
          marginTop: 4,
        }}
      >
        {t(`modal.perks.stepper.${isSubmitting ? 'submitting' : 'submit'}`)}
      </Button>
    </>
  );
};

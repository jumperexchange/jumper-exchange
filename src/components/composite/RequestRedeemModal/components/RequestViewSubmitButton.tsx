import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useWidgetStore } from '@/components/composite/JumperWidget/store';
import { useWidgetSubmit } from '@/components/composite/JumperWidget/store';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import { useGetZapInPoolBalance } from '@/hooks/zaps/useGetZapInPoolBalance';
import { useToken } from '@/hooks/useToken';
import type { Address, Hex } from 'viem';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useTranslation } from 'react-i18next';
import type { AmountValue } from '../../JumperWidget/components/Amount';

interface RequestViewSubmitButtonProps {
  isFormSubmitting: boolean;
}

export const RequestViewSubmitButton: FC<RequestViewSubmitButtonProps> = ({
  isFormSubmitting,
}) => {
  const { t } = useTranslation();
  const accountAddress = useAccountAddress();
  const field = useWidgetStore((s) => s.values['requestAmount']) as AmountValue;
  const requestAmount = field?.amount;
  const requestMaxAmount = field?.maxAmount;
  const { isSubmitting } = useWidgetSubmit();

  const isDisabled =
    isFormSubmitting ||
    isSubmitting ||
    !accountAddress ||
    !requestAmount ||
    !requestMaxAmount ||
    requestAmount === '0' ||
    BigInt(requestAmount) > BigInt(requestMaxAmount);

  const isLoading = isFormSubmitting || isSubmitting;

  return (
    <Button
      variant={Variant.Primary}
      size={Size.LG}
      fullWidth
      type="submit"
      disabled={isDisabled}
      loading={isLoading}
    >
      {t('buttons.requestWithdraw')}
    </Button>
  );
};

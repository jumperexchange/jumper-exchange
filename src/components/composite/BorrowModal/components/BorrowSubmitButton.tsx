import type { AmountValue } from '@/components/composite/JumperWidget/components/Amount';
import {
  useWidgetStore,
  useWidgetSubmit,
} from '@/components/composite/JumperWidget/store';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useLeverageContext } from '../context';

export function BorrowSubmitButton() {
  const accountAddress = useAccountAddress();
  const { isTransactionSubmitting } = useLeverageContext();
  const amountValue = useWidgetStore((s) => s.values['amount']) as
    | AmountValue
    | undefined;
  const { isSubmitting } = useWidgetSubmit();

  const isDisabled =
    isTransactionSubmitting ||
    isSubmitting ||
    !accountAddress ||
    !amountValue?.amount ||
    amountValue.amount === '0';

  return (
    <Button
      variant={Variant.Primary}
      size={Size.LG}
      fullWidth
      type="submit"
      disabled={isDisabled}
      loading={isTransactionSubmitting || isSubmitting}
    >
      Leverage
    </Button>
  );
}

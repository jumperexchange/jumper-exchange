import { useMemo } from 'react';
import { z } from 'zod';
import { useField } from '../store';
import type { BaseFieldProps } from '../types';
import type { Balance, PricedToken } from '@/types/tokens';
import { FieldWrapper, Label, Placeholder } from '../JumperWidget.style';
import Box from '@mui/material/Box';
import { AvatarSkeleton } from '@/components/core/AvatarStack/AvatarStack.styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { TokenStack } from '../../TokenStack/TokenStack';
import { SelectSidePanel } from './Shared';

export const balancesMultiSelectSchema = z.object({
  selectedAddresses: z.array(z.string()).min(1),
});

export type BalancesMultiSelectValue = z.infer<
  typeof balancesMultiSelectSchema
>;

export interface BalancesMultiSelectFieldProps<
  T extends PricedToken = PricedToken,
> extends BaseFieldProps {
  label?: string;
  placeholder?: string;
  header?: string;
  availableBalances: Balance<T>[];
  formatAmount?: (amount: bigint, decimals: number) => string;
}

const defaultFormatAmount = (amount: bigint, decimals: number): string => {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;
  const fractional = remainder.toString().padStart(decimals, '0').slice(0, 4);
  return `${whole}.${fractional}`;
};

export const BalancesMultiSelectField = <T extends PricedToken = PricedToken>({
  label,
  placeholder = 'Select tokens',
  fieldKey,
  availableBalances,
}: BalancesMultiSelectFieldProps<T>) => {
  const field = useField<BalancesMultiSelectValue>(fieldKey);

  const selectedTokens = useMemo(() => {
    return availableBalances
      .filter((balance) =>
        field.value?.selectedAddresses.includes(balance.token.address),
      )
      .map((balance) => ({
        ...balance.token,
        chain: {
          chainId: balance.token.chainId,
          chainKey: balance.token.chainId.toString(),
        },
      }));
  }, [availableBalances, field.value?.selectedAddresses]);

  return (
    <FieldWrapper onClick={field.openSidePanel} sx={{ cursor: 'pointer' }}>
      {!!label && <Label>{label}</Label>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {selectedTokens.length ? (
          <TokenStack tokens={selectedTokens} size={AvatarSize.XL} />
        ) : (
          <>
            <AvatarSkeleton size={AvatarSize.XL} variant="circular" />
            <Placeholder>{placeholder}</Placeholder>
          </>
        )}
      </Box>
    </FieldWrapper>
  );
};

export const BalancesMultiSelectSidePanel = <
  T extends PricedToken = PricedToken,
>({
  fieldKey,
  availableBalances,
  formatAmount = defaultFormatAmount,
  header,
}: BalancesMultiSelectFieldProps<T>) => {
  const field = useField<BalancesMultiSelectValue>(fieldKey);
  const selectedAddresses = field.value?.selectedAddresses ?? [];

  return (
    <SelectSidePanel
      isActive={field.isActive}
      header={header}
      options={availableBalances.map((balance) => ({
        key: balance.token.address,
        logoURI: balance.token.logoURI,
        name: balance.token.name,
      }))}
      isSelected={(key) => selectedAddresses.includes(key)}
      onSelect={(key) => {
        const next = selectedAddresses.includes(key)
          ? selectedAddresses.filter((a) => a !== key)
          : [...selectedAddresses, key];
        field.setValue(
          next.length > 0 ? { selectedAddresses: next } : undefined!,
        );
      }}
      onClose={field.closeSidePanel}
    />
  );
};

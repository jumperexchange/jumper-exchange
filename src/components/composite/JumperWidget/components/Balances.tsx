import z from 'zod';
import { useMemo } from 'react';
import type { PricedToken } from '@/types/tokens';
import type { Balance } from '@/types/tokens';
import { fieldSx, Label } from '../JumperWidget.style';
import { AvatarSkeleton } from '@/components/core/AvatarStack/AvatarStack.styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { TokenStack } from '../../TokenStack/TokenStack';
import { SelectSidePanel } from './Shared';
import { SelectCard } from '@/components/Cards/SelectCard/SelectCard';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import Typography from '@mui/material/Typography';
import { useField } from '../store';
import type { BaseFieldProps } from '../types';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

export interface BalancesMultiSelectSchemaOptions {
  min?: number;
  max?: number;
}

export const createBalancesMultiSelectSchema = (
  t: TFunction,
  options?: BalancesMultiSelectSchemaOptions,
) => {
  let selectedAddressesSchema = z.array(z.string()).min(options?.min ?? 1);

  if (options?.max !== undefined) {
    selectedAddressesSchema = selectedAddressesSchema.max(
      options.max,
      t('jumperWidget.fieldErrors.balancesMultiSelect.max', {
        count: options.max,
      }),
    );
  }
  return z.object({
    selectedAddresses: selectedAddressesSchema,
  });
};

export type BalancesMultiSelectValue = z.infer<
  ReturnType<typeof createBalancesMultiSelectSchema>
>;

export interface BalancesMultiSelectFieldProps<
  T extends PricedToken = PricedToken,
> extends BaseFieldProps {
  label?: string;
  placeholder?: string;
  header?: string;
  availableBalances: Balance<T>[];
}

export const BalancesMultiSelectField = <T extends PricedToken = PricedToken>({
  label,
  placeholder,
  fieldKey,
  availableBalances,
}: BalancesMultiSelectFieldProps<T>) => {
  const { t } = useTranslation();
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
    <SelectCard
      label={label}
      valueVariant="bodyLargeStrong"
      mode={SelectCardMode.Display}
      placeholder={
        selectedTokens.length
          ? ''
          : (placeholder ?? t('jumperWidget.placeholder.balancesMultiSelect'))
      }
      placeholderVariant="bodyLarge"
      startAdornment={
        selectedTokens.length ? (
          <TokenStack tokens={selectedTokens} size={AvatarSize.XL} />
        ) : (
          <AvatarSkeleton size={AvatarSize.XL} variant="circular" />
        )
      }
      onClick={field.openSidePanel}
      sx={fieldSx}
    />
  );
};

export const BalancesMultiSelectSidePanel = <
  T extends PricedToken = PricedToken,
>({
  fieldKey,
  availableBalances,
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
        field.setValue({ selectedAddresses: next });
      }}
      onClose={field.closeSidePanel}
    >
      {field.isTouched && field.errors.length > 0 ? (
        <Typography
          variant="bodyXXSmallStrong"
          color="error"
          sx={{
            mt: 0.5,
          }}
        >
          {field.errors[0]}
        </Typography>
      ) : null}
    </SelectSidePanel>
  );
};

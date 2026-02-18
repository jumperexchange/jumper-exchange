import type { FC } from 'react';
import { z } from 'zod';
import { useField } from '../store';
import type { BaseFieldProps } from '../types';
import type { PricedToken } from '@/types/tokens';
import { fieldSx } from '../JumperWidget.style';
import { AvatarSkeleton } from '@/components/core/AvatarStack/AvatarStack.styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { TokenStack } from '../../TokenStack/TokenStack';
import { OptionIcon, SelectSidePanel } from './Shared';
import { SelectCard } from '@/components/Cards/SelectCard/SelectCard';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';

export const tokenSingleSelectSchema = z.object({
  selectedToken: z.string().min(1),
});

export const tokenMultiSelectSchema = z.object({
  selectedTokens: z.array(z.string()).min(1),
});

export type TokenSingleSelectValue = z.infer<typeof tokenSingleSelectSchema>;
export type TokenMultiSelectValue = z.infer<typeof tokenMultiSelectSchema>;

interface TokenFieldBaseProps extends BaseFieldProps {
  availableTokens: PricedToken[];
}

export type TokenSingleSelectFieldProps = TokenFieldBaseProps;
export type TokenMultiSelectFieldProps = TokenFieldBaseProps;

export const TokenSingleSelectField: FC<TokenSingleSelectFieldProps> = ({
  label,
  placeholder = 'Select token',
  fieldKey,
  availableTokens,
}) => {
  const field = useField<TokenSingleSelectValue>(fieldKey);

  const selectedToken = availableTokens.find(
    (t) => t.address === field.value?.selectedToken,
  );

  return (
    <SelectCard
      label={label}
      value={selectedToken?.name}
      valueVariant="bodyLargeStrong"
      mode={SelectCardMode.Display}
      placeholder={placeholder}
      placeholderVariant="bodyLarge"
      startAdornment={
        selectedToken ? (
          <OptionIcon
            logoURI={selectedToken.logoURI}
            name={selectedToken.name}
            id={selectedToken.address}
          />
        ) : (
          <AvatarSkeleton size={AvatarSize.XL} variant="circular" />
        )
      }
      onClick={field.openSidePanel}
      sx={fieldSx}
    />
  );
};

export const TokenSingleSelectSidePanel: FC<TokenSingleSelectFieldProps> = ({
  fieldKey,
  header,
  availableTokens,
}) => {
  const field = useField<TokenSingleSelectValue>(fieldKey);

  return (
    <SelectSidePanel
      isActive={field.isActive}
      header={header}
      options={availableTokens.map((t) => ({
        key: t.address,
        logoURI: t.logoURI,
        name: t.name,
      }))}
      isSelected={(key) => field.value?.selectedToken === key}
      onSelect={(key) => {
        field.setValue({ selectedToken: key });
        field.closeSidePanel();
      }}
      onClose={field.closeSidePanel}
    />
  );
};

export const TokenMultiSelectField: FC<TokenMultiSelectFieldProps> = ({
  label,
  placeholder = 'Select tokens',
  fieldKey,
  availableTokens,
}) => {
  const field = useField<TokenMultiSelectValue>(fieldKey);

  const selectedAddresses = field.value?.selectedTokens ?? [];
  const selectedTokens = availableTokens
    .filter((t) => selectedAddresses.includes(t.address))
    .map((t) => ({
      ...t,
      chain: { chainId: t.chainId, chainKey: t.chainId.toString() },
    }));
  return (
    <SelectCard
      label={label}
      valueVariant="bodyLargeStrong"
      mode={SelectCardMode.Display}
      placeholder={placeholder}
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

export const TokenMultiSelectSidePanel: FC<TokenMultiSelectFieldProps> = ({
  fieldKey,
  header,
  availableTokens,
}) => {
  const field = useField<TokenMultiSelectValue>(fieldKey);
  const selectedTokens = field.value?.selectedTokens ?? [];

  return (
    <SelectSidePanel
      isActive={field.isActive}
      header={header}
      options={availableTokens.map((t) => ({
        key: t.address,
        logoURI: t.logoURI,
        name: t.name,
      }))}
      isSelected={(key) => selectedTokens.includes(key)}
      onSelect={(key) => {
        const next = selectedTokens.includes(key)
          ? selectedTokens.filter((a) => a !== key)
          : [...selectedTokens, key];
        field.setValue(next.length > 0 ? { selectedTokens: next } : undefined!);
      }}
      onClose={field.closeSidePanel}
    />
  );
};

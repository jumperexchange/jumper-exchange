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
import Typography from '@mui/material/Typography';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

export interface TokenSingleSelectSchemaOptions {
  /**
   * Whitelist of token addresses that are valid selections.
   * When provided, selecting a token outside this set will fail validation.
   */
  allowedAddresses?: string[];
}

export const createTokenSingleSelectSchema = (
  t: TFunction,
  options: TokenSingleSelectSchemaOptions = {},
) => {
  const { allowedAddresses } = options;

  let selectedTokenSchema = z
    .string()
    .min(1, t('jumperWidget.fieldErrors.tokenSingleSelect.min'));

  if (allowedAddresses?.length) {
    selectedTokenSchema = selectedTokenSchema.refine(
      (addr) => allowedAddresses.includes(addr),
      { message: t('jumperWidget.fieldErrors.tokenSingleSelect.notSupported') },
    );
  }

  return z.object({ selectedToken: selectedTokenSchema });
};

export interface TokenMultiSelectSchemaOptions {
  /**
   * Minimum number of tokens that must be selected. Defaults to 1.
   */
  min?: number;
  /**
   * Maximum number of tokens that can be selected.
   * When provided, exceeding this limit surfaces a validation error.
   */
  max?: number;
  /**
   * Whitelist of token addresses that are valid selections.
   */
  allowedAddresses?: string[];
}

export const createTokenMultiSelectSchema = (
  t: TFunction,
  options: TokenMultiSelectSchemaOptions = {},
) => {
  const { min = 1, max, allowedAddresses } = options;

  let selectedTokensSchema = z
    .array(z.string())
    .min(
      min,
      t('jumperWidget.fieldErrors.tokenMultiSelect.min', { count: min }),
    );

  if (max !== undefined) {
    selectedTokensSchema = selectedTokensSchema.max(
      max,
      t('jumperWidget.fieldErrors.tokenMultiSelect.max', { count: max }),
    );
  }

  if (allowedAddresses?.length) {
    selectedTokensSchema = selectedTokensSchema.refine(
      (addrs) => addrs.every((a) => allowedAddresses.includes(a)),
      {
        message: t('jumperWidget.fieldErrors.tokenMultiSelect.notSupported'),
      },
    ) as typeof selectedTokensSchema;
  }

  return z.object({ selectedTokens: selectedTokensSchema });
};

export type TokenSingleSelectValue = z.infer<
  ReturnType<typeof createTokenSingleSelectSchema>
>;
export type TokenMultiSelectValue = z.infer<
  ReturnType<typeof createTokenMultiSelectSchema>
>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface TokenFieldBaseProps extends BaseFieldProps {
  label?: string;
  placeholder?: string;
  header?: string;
  availableTokens: PricedToken[];
}

export type TokenSingleSelectFieldProps = TokenFieldBaseProps;
export type TokenMultiSelectFieldProps = TokenFieldBaseProps;

export const TokenSingleSelectField: FC<TokenSingleSelectFieldProps> = ({
  label,
  placeholder,
  fieldKey,
  availableTokens,
}) => {
  const { t } = useTranslation();
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
      placeholder={
        placeholder ?? t('jumperWidget.placeholder.tokenSingleSelect')
      }
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

export const TokenMultiSelectField: FC<TokenMultiSelectFieldProps> = ({
  label,
  placeholder,
  fieldKey,
  availableTokens,
}) => {
  const { t } = useTranslation();
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
      placeholder={
        placeholder ?? t('jumperWidget.placeholder.tokenMultiSelect')
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
        field.setValue({ selectedTokens: next });
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

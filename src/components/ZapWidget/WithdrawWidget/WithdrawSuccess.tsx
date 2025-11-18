import { SelectCard } from '@/components/Cards/SelectCard/SelectCard';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '@/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { currencyFormatter } from '@/utils/formatNumbers';
import { formatTokenPrice } from '@lifi/widget';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroupContainer } from './WithdrawWidget.style';
import { ButtonPrimary, ButtonSecondary } from '@/components/Button';
import { useChains } from '@/hooks/useChains';
import { openInNewTab } from '@/utils/openInNewTab';
import type { WithdrawSuccessProps } from './WithdrawWidget.types';
import { USD_DECIMALS } from './constants';

export const WithdrawSuccess: FC<WithdrawSuccessProps> = ({
  token,
  value,
  chainId,
  txHash,
  onClose,
}) => {
  const { t } = useTranslation();
  const chains = useChains();
  const chain = useMemo(() => chains.getChainById(chainId), [chains, chainId]);
  const explorerUrl = useMemo(
    () => chain?.metamask?.blockExplorerUrls?.[0] ?? 'https://etherscan.io/',
    [chain],
  );

  const tokens = useMemo(() => {
    return [
      {
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        logo: token.logoURI ?? '',
        chain: { chainId: token.chainId, chainKey: token.coinKey ?? '' },
      },
    ];
  }, [token]);

  const hint = useMemo(() => {
    const priceValue = formatTokenPrice(value, token?.priceUSD);
    return currencyFormatter('en-US', {
      notation: 'compact',
      currency: 'USD',
      useGrouping: true,
      minimumFractionDigits: USD_DECIMALS,
      maximumFractionDigits: USD_DECIMALS,
    })(priceValue);
  }, [value, token?.priceUSD]);

  const handleSeeDetails = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openInNewTab(`${explorerUrl}tx/${txHash}`);
  };

  return (
    <>
      <SelectCard
        value={value}
        description={hint}
        placeholder=""
        mode={SelectCardMode.Display}
        label={t('widget.withdraw.received')}
        startAdornment={
          <EntityChainStack
            variant={EntityChainStackVariant.Tokens}
            tokens={tokens}
            tokensSize={AvatarSize.XXL}
            isContentVisible={false}
          />
        }
      />
      <ButtonGroupContainer>
        <ButtonSecondary
          sx={{ padding: 2 }}
          fullWidth
          onClick={handleSeeDetails}
          type="button"
        >
          {t('widget.withdraw.success.seeDetails')}
        </ButtonSecondary>
        <ButtonPrimary
          sx={{ padding: 2 }}
          fullWidth
          onClick={onClose}
          type="button"
        >
          {t('widget.withdraw.success.done')}
        </ButtonPrimary>
      </ButtonGroupContainer>
    </>
  );
};

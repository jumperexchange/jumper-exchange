import type { FC } from 'react';
import { useMemo } from 'react';
import { WithdrawFormContainer } from './WithdrawWidget.style';
import { formatUnits } from 'viem';
import { Button } from 'src/components/Button/Button';
import { ConnectButton } from 'src/components/ConnectButton';
import { useAccount } from '@lifi/wallet-management';
import { WithdrawInput } from './WithdrawInput';
import WithdrawInputEndAdornment from './WithdrawInputEndAdornment';
import type { WithdrawFormProps } from './WithdrawWidget.types';
import type { Theme } from '@mui/material/styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityChainStack } from '@/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '@/components/composite/EntityChainStack/EntityChainStack.types';

const buttonStyles = (theme: Theme) => ({
  marginTop: theme.spacing(2),
  '&:hover': { boxShadow: 'none' },
});

export const WithdrawForm: FC<WithdrawFormProps> = ({
  balance,
  lpTokenDecimals,
  token,
  overrideStyle,
  isSubmitDisabled,
  isSubmitLoading,
  submitLabel,
  setWithdrawValue,
  withdrawValue,
}) => {
  const { account } = useAccount();

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

  const maxFormattedAmount = useMemo(() => {
    return parseFloat(formatUnits(BigInt(balance), lpTokenDecimals));
  }, [balance, lpTokenDecimals]);

  const maxAmount = useMemo(() => {
    return BigInt(balance);
  }, [balance]);

  const hintEndAdornment = useMemo(() => {
    return (
      `/ ` +
      Intl.NumberFormat('en-US', {
        notation: 'compact',
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: maxFormattedAmount > 1 ? 1 : 4,
      }).format(maxFormattedAmount)
    );
  }, [maxFormattedAmount]);

  return (
    <WithdrawFormContainer>
      <WithdrawInput
        name="withdrawValue"
        label={`Withdraw`}
        priceUSD={token?.priceUSD}
        decimals={token?.decimals}
        symbol={token?.symbol}
        endAdornment={
          !!account.address &&
          !!balance &&
          parseFloat(balance) > 0 && (
            <WithdrawInputEndAdornment
              mainColor={overrideStyle?.mainColor}
              setValue={setWithdrawValue}
              maxAmount={maxAmount}
              decimals={lpTokenDecimals}
            />
          )
        }
        value={withdrawValue}
        onSetValue={setWithdrawValue}
        maxValue={maxFormattedAmount.toString()}
        startAdornment={
          <EntityChainStack
            variant={EntityChainStackVariant.Tokens}
            tokens={tokens}
            tokensSize={AvatarSize.XXL}
            isContentVisible={false}
          />
        }
        hintEndAdornment={hintEndAdornment}
      />

      {!account?.isConnected ? (
        <ConnectButton sx={buttonStyles} />
      ) : (
        <Button
          type="submit"
          loading={isSubmitLoading}
          loadingPosition="start"
          disabled={balance === '0' || isSubmitDisabled}
          muiVariant="contained"
          variant="primary"
          styles={buttonStyles}
        >
          {submitLabel}
        </Button>
      )}
    </WithdrawFormContainer>
  );
};

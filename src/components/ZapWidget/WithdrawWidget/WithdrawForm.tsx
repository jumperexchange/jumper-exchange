import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { WithdrawFormContainer } from './WithdrawWidget.style';
import { AbiParameter, formatUnits, parseUnits } from 'viem';
import { Button } from 'src/components/Button/Button';
import { ConnectButton } from 'src/components/ConnectButton';
import {
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { useToken } from 'src/hooks/useToken';
import { WithdrawInput } from './WithdrawInput';
import BadgeWithChain from '../BadgeWithChain';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import { TrackingCategory } from 'src/const/trackingKeys';
import WithdrawInputEndAdornment from './WithdrawInputEndAdornment';
import { WithdrawFormProps } from './WithdrawWidget.types';
import { Theme } from '@mui/material/styles';

const buttonStyles = (theme: Theme) => ({
  marginTop: theme.spacing(2),
  '&:hover': { boxShadow: 'none' },
});

export const WithdrawForm: FC<WithdrawFormProps> = ({
  sendWithdrawTx,
  successDataRef,
  errorMessage,
  projectData,
  balance,
  lpTokenDecimals,
  token,
  poolName,
  overrideStyle,
  refetchPosition,
  isSubmitDisabled,
  isSubmitLoading,
  submitLabel,
}) => {
  const [value, setValue] = useState<string>('');
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();
  const { switchChainAsync } = useSwitchChain();
  const { token: tokenInfo } = useToken(token.chainId, token.address);

  const maxFormattedAmount = useMemo(() => {
    return parseFloat(formatUnits(BigInt(balance), lpTokenDecimals));
  }, [balance, lpTokenDecimals]);

  const maxAmount = useMemo(() => {
    return BigInt(balance);
  }, [balance]);

  const helperText = useMemo(
    () => ({
      left: 'Available balance',
      right: balance,
    }),
    [balance],
  );

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

  const shouldSwitchChain = useMemo(() => {
    if (!!projectData?.address && account?.chainId !== projectData?.chainId) {
      return true;
    }
    return false;
  }, [account?.chainId, projectData]);

  const handleSwitchChain = async (chainId: number) => {
    try {
      await switchChainAsync({
        chainId: chainId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateSuccessDataRef = useCallback(() => {
    successDataRef.current = {
      token,
      value,
      tokenPriceUSD: tokenInfo?.priceUSD,
      callback: () => {
        setValue('');
        refetchPosition();
      },
    };
  }, [value, token, tokenInfo, setValue, refetchPosition]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!value) {
        return;
      }
      try {
        updateSuccessDataRef();
        sendWithdrawTx(value);
      } catch (e) {
        console.error(e);
      }
    },
    [sendWithdrawTx, value],
  );

  return (
    <WithdrawFormContainer as="form" onSubmit={handleSubmit}>
      <WithdrawInput
        name="withdrawValue"
        placeholder="0"
        label={`Withdraw from ${poolName || 'Pool'}`}
        errorMessage={errorMessage}
        priceUSD={tokenInfo?.priceUSD}
        endAdornment={
          !!account.address &&
          !!balance &&
          parseFloat(balance) > 0 && (
            <WithdrawInputEndAdornment
              mainColor={overrideStyle?.mainColor}
              setValue={setValue}
              maxAmount={maxAmount}
              decimals={lpTokenDecimals}
            />
          )
        }
        value={value}
        onSetValue={setValue}
        maxValue={maxFormattedAmount.toString()}
        startAdornment={
          token?.logoURI && (
            <BadgeWithChain
              chainId={projectData?.chainId}
              logoURI={token?.logoURI}
              alt={token?.name}
            />
          )
        }
        hintEndAdornment={hintEndAdornment}
      />
      {!account?.isConnected ? (
        <ConnectButton sx={buttonStyles} />
      ) : shouldSwitchChain ? (
        <Button
          styles={buttonStyles}
          muiVariant="contained"
          onClick={() => handleSwitchChain(projectData?.chainId)}
        >
          Switch chain
        </Button>
      ) : (
        <Button
          type="submit"
          loading={isSubmitLoading}
          disabled={balance === '0' || isSubmitDisabled}
          muiVariant="contained"
          styles={buttonStyles}
        >
          {submitLabel}
        </Button>
      )}
    </WithdrawFormContainer>
  );
};

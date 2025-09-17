import { ChainId, ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type { FormState } from '@lifi/widget';
import { RefObject, useEffect, useMemo } from 'react';
import { ExtendedChainId } from 'src/components/Widgets/Widget.types';
import { ARB_NATIVE_USDC } from 'src/config/tokens';
import { useUrlParams } from './useUrlParams';
import { useChains } from './useChains';

interface UseWidgetSelectionProps {
  formRef?: RefObject<FormState | null>;
  allowToChains?: number[];
  configThemeChains?: {
    to?: {
      allow?: number[];
    };
  };
}

export const useBridgeConditions = ({
  formRef,
  allowToChains,
  configThemeChains,
}: UseWidgetSelectionProps) => {
  const { account } = useAccount();
  const isConnectedAGW = account?.connector?.name === 'Abstract';
  const { getChainById } = useChains();

  const {
    sourceChainToken: sourceChainTokenParam,
    destinationChainToken: destinationChainTokenParam,
    toAddress,
  } = useUrlParams();

  const sourceChainType = useMemo(() => {
    if (!sourceChainTokenParam?.chainId) {
      return undefined;
    }
    return getChainById(sourceChainTokenParam.chainId)?.chainType;
  }, [sourceChainTokenParam?.chainId, getChainById]);

  // // Handle initial URL parameter clearing
  useEffect(() => {
    if (
      configThemeChains?.to?.allow?.includes(ChainId.ABS) ||
      allowToChains?.includes(ChainId.ABS) ||
      !formRef?.current ||
      !isConnectedAGW
    ) {
      return;
    }

    formRef.current.setFieldValue('toAddress', undefined, {
      setUrlSearchParam: true,
    });
  }, [
    allowToChains,
    configThemeChains?.to?.allow,
    formRef?.current,
    isConnectedAGW,
  ]);

  // Bridge condition checks
  const bridgeConditions = useMemo(() => {
    const isBridgeFromHypeToArbNativeUSDC =
      sourceChainTokenParam?.chainId === ExtendedChainId.HYPE &&
      destinationChainTokenParam?.chainId === ChainId.ARB &&
      destinationChainTokenParam?.token?.toLowerCase() ===
        ARB_NATIVE_USDC.toLowerCase();

    const isBridgeFromEvmToHype =
      sourceChainType === ChainType.EVM &&
      destinationChainTokenParam?.chainId === ExtendedChainId.HYPE;

    const isAGWToNonABSChain =
      isConnectedAGW && destinationChainTokenParam?.chainId !== ChainId.ABS;

    return {
      isBridgeFromHypeToArbNativeUSDC,
      isBridgeFromEvmToHype,
      isAGWToNonABSChain,
    };
  }, [
    sourceChainTokenParam.chainId,
    sourceChainType,
    destinationChainTokenParam.chainId,
    destinationChainTokenParam.token,
    isConnectedAGW,
  ]);

  useEffect(() => {
    if (!formRef?.current) return;

    if (
      (isConnectedAGW && toAddress === account.address) ||
      bridgeConditions.isBridgeFromEvmToHype ||
      bridgeConditions.isBridgeFromHypeToArbNativeUSDC
    ) {
      formRef.current.setFieldValue('toAddress', undefined, {
        setUrlSearchParam: true,
      });
    }
  }, [
    bridgeConditions.isBridgeFromEvmToHype,
    bridgeConditions.isBridgeFromHypeToArbNativeUSDC,
    toAddress,
    account.address,
    isConnectedAGW,
  ]);

  return bridgeConditions;
};

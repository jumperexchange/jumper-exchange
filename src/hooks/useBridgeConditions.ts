import { ChainId, ChainType, type Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type { FormState } from '@lifi/widget';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { type RefObject, useEffect, useMemo, useState } from 'react';
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
  const widgetEvents = useWidgetEvents();
  const [isPrivateSwapSelected, setIsPrivateSwapSelected] = useState(false);

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

  useEffect(() => {
    const handleSelectedRoute = ({ route }: { route: Route }) => {
      setIsPrivateSwapSelected(
        route.steps.some((step) => step.tool === 'houdini'),
      );
    };

    const handleResetPrivateSwapSelected = () => {
      setIsPrivateSwapSelected(false);
    };
    const handleResetPrivateSwapSelectedForPageEntered = (path: string) => {
      if (path === '/routes' || path === '/') {
        setIsPrivateSwapSelected(false);
      }
    };

    widgetEvents.on(WidgetEvent.RouteSelected, handleSelectedRoute);
    widgetEvents.on(
      WidgetEvent.RouteExecutionStarted,
      handleResetPrivateSwapSelected,
    );
    widgetEvents.on(
      WidgetEvent.PageEntered,
      handleResetPrivateSwapSelectedForPageEntered,
    );

    return () => {
      widgetEvents.off(WidgetEvent.RouteSelected, handleSelectedRoute);
      widgetEvents.off(
        WidgetEvent.RouteExecutionStarted,
        handleResetPrivateSwapSelected,
      );
      widgetEvents.off(
        WidgetEvent.PageEntered,
        handleResetPrivateSwapSelectedForPageEntered,
      );
    };
  }, [widgetEvents]);

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
      isPrivateSwapSelected,
      toAddress,
    };
  }, [
    sourceChainTokenParam.chainId,
    sourceChainType,
    destinationChainTokenParam.chainId,
    destinationChainTokenParam.token,
    isConnectedAGW,
  ]);

  useEffect(() => {
    if (!formRef?.current) {
      return;
    }

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

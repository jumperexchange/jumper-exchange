import { ChainId, ChainType, type Route } from '@lifi/sdk';
import { useAccount } from '@jumperexchange/wallet-management';
import type { FormFieldChanged, FormState } from '@jumperexchange/widget';
import { useWidgetEvents, WidgetEvent } from '@jumperexchange/widget';
import { type RefObject, useEffect, useMemo, useState } from 'react';
import { ExtendedChainId } from 'src/components/Widgets/Widget.types';
import { ARB_NATIVE_USDC } from 'src/config/tokens';
import { useUrlParams } from './useUrlParams';
import { useChains } from './useChains';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
} from '@/components/Widgets/WidgetEventsManager';

const PRIVATE_SWAP_TOOL_KEYS = ['houdini'];

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
  const [toAddress, setToAddress] = useState<string | undefined>(undefined);

  const {
    sourceChainToken: sourceChainTokenParam,
    destinationChainToken: destinationChainTokenParam,
    toAddress: toAddressUrlParams,
  } = useUrlParams();

  useEffect(() => {
    setToAddress(toAddressUrlParams);
  }, [toAddressUrlParams]);

  const sourceChainType = useMemo(() => {
    if (!sourceChainTokenParam?.chainId) {
      return undefined;
    }
    return getChainById(sourceChainTokenParam.chainId)?.chainType;
  }, [sourceChainTokenParam?.chainId, getChainById]);

  useEffect(() => {
    const handleSelectedRoute = ({ route }: { route: Route }) => {
      setIsPrivateSwapSelected(
        route.steps.some((step) => PRIVATE_SWAP_TOOL_KEYS.includes(step.tool)),
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
    const handleToAddressChange = (params: FormFieldChanged) => {
      if (params?.fieldName === 'toAddress' && params.newValue !== undefined) {
        setToAddress(params.newValue);
      }
    };
    const widgetEventsConfig = {
      routeSelected: handleSelectedRoute,
      routeExecutionStarted: handleResetPrivateSwapSelected,
      pageEntered: handleResetPrivateSwapSelectedForPageEntered,
      formFieldChanged: handleToAddressChange,
    };

    setupWidgetEvents(widgetEventsConfig, widgetEvents);

    return () => {
      teardownWidgetEvents(widgetEventsConfig, widgetEvents);
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
    isPrivateSwapSelected,
    toAddress,
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

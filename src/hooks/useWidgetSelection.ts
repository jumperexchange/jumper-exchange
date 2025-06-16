import { ChainId, ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type { FormFieldChanged, FormState } from '@lifi/widget';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { RefObject, useEffect, useMemo, useState } from 'react';
import { ExtendedChainId } from 'src/components/Widgets/Widget.types';
import { ARB_NATIVE_USDC } from 'src/config/tokens';
import { useUrlParams } from './useUrlParams';
import { useWidgetSelectedChains } from './useWidgetSelectedChains';

interface UseWidgetSelectionProps {
  formRef?: RefObject<FormState | null>;
  wrapperRef?: RefObject<HTMLDivElement | null>;
  allowToChains?: number[];
  configThemeChains?: {
    to?: {
      allow?: number[];
    };
  };
}

export const useWidgetSelection = ({
  formRef,
  wrapperRef,
  allowToChains,
  configThemeChains,
}: UseWidgetSelectionProps) => {
  const widgetEvents = useWidgetEvents();
  const { account } = useAccount();
  const isConnectedAGW = account?.connector?.name === 'Abstract';
  const { sourceChainToken, destinationChainToken } = useWidgetSelectedChains();

  const {
    sourceChainToken: sourceChainTokenParam,
    destinationChainToken: destinationChainTokenParam,
    toAddress,
    fromAmount,
  } = useUrlParams();

  const [formValues, setFormValues] = useState<{
    fromChain?: number;
    fromToken?: string;
    toChain?: number;
    toToken?: string;
    fromAmount?: string;
    toAddress?: string;
  }>({
    fromChain: sourceChainTokenParam?.chainId,
    fromToken: sourceChainTokenParam?.token,
    toChain: destinationChainTokenParam?.chainId,
    toToken: destinationChainTokenParam?.token,
    fromAmount: fromAmount,
    toAddress: toAddress,
  });

  // Handle initial URL parameter clearing
  useEffect(() => {
    if (
      !wrapperRef?.current ||
      configThemeChains?.to?.allow?.includes(ChainId.ABS) ||
      allowToChains?.includes(ChainId.ABS)
    ) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (formRef?.current && isConnectedAGW) {
        formRef.current.setFieldValue('toAddress', undefined, {
          setUrlSearchParam: true,
        });
        observer.disconnect();
      }
    });

    observer.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [
    allowToChains,
    configThemeChains?.to?.allow,
    isConnectedAGW,
    formRef,
    wrapperRef,
  ]);

  // Bridge condition checks
  const bridgeConditions = useMemo(() => {
    const isBridgeFromHypeToArbNativeUSDC =
      sourceChainToken?.chainId === ExtendedChainId.HYPE &&
      destinationChainToken?.chainId === ChainId.ARB &&
      destinationChainToken?.tokenAddress?.toLowerCase() ===
        ARB_NATIVE_USDC.toLowerCase();

    const isBridgeFromEvmToHype =
      sourceChainToken.chainType === ChainType.EVM &&
      destinationChainToken.chainId === ExtendedChainId.HYPE;

    const isAGWToNonABSChain =
      isConnectedAGW && destinationChainToken?.chainId !== ChainId.ABS;

    return {
      isBridgeFromHypeToArbNativeUSDC,
      isBridgeFromEvmToHype,
      isAGWToNonABSChain,
      shouldHideToAddress:
        isBridgeFromHypeToArbNativeUSDC || isBridgeFromEvmToHype,
      shouldRequireToAddress: isAGWToNonABSChain,
    };
  }, [
    sourceChainToken.chainId,
    sourceChainToken.chainType,
    destinationChainToken.chainId,
    destinationChainToken.tokenAddress,
    isConnectedAGW,
  ]);

  useEffect(() => {
    if (!formRef?.current) return;

    if (isConnectedAGW && formValues.toAddress === account.address) {
      formRef.current.setFieldValue('toAddress', undefined, {
        setUrlSearchParam: true,
      });
      return;
    }

    if (
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
    formValues.toAddress,
    account.address,
    isConnectedAGW,
  ]);

  useEffect(() => {
    const handleFormFieldChanged = (fieldChange: FormFieldChanged) => {
      if (!fieldChange) return;

      // Update form values
      setFormValues((prev) => ({
        ...prev,
        [fieldChange.fieldName]: fieldChange.newValue,
      }));
    };

    widgetEvents.on(WidgetEvent.FormFieldChanged, handleFormFieldChanged);
    return () => {
      widgetEvents.off(WidgetEvent.FormFieldChanged, handleFormFieldChanged);
    };
  }, [
    widgetEvents,
    formRef,
    isConnectedAGW,
    account.address,
    formValues.toChain,
    formValues.toToken,
    sourceChainToken.chainType,
  ]);

  return {
    bridgeConditions,
  };
};

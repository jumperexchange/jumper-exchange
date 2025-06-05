import { ChainId, ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type {
  ChainTokenSelected,
  FormFieldChanged,
  FormState,
} from '@lifi/widget';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { RefObject, useEffect, useMemo, useState } from 'react';
import { ARB_NATIVE_USDC } from 'src/config/tokens';
import { useChains } from './useChains';
import { useUrlParams } from './useUrlParams';

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
  const { getChainById } = useChains();
  const widgetEvents = useWidgetEvents();
  const { account } = useAccount();
  const isConnectedAGW = account?.connector?.name === 'Abstract';

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
      configThemeChains?.to?.allow?.includes(2741) ||
      allowToChains?.includes(2741)
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

  const sourceChainToken = useMemo<ChainTokenSelected | undefined>(() => {
    if (formValues.fromChain && formValues.fromToken) {
      return {
        chainId: formValues.fromChain,
        tokenAddress: formValues.fromToken,
      };
    }
    if (sourceChainTokenParam?.chainId && sourceChainTokenParam?.token) {
      return {
        chainId: sourceChainTokenParam.chainId,
        tokenAddress: sourceChainTokenParam.token,
      };
    }
    return undefined;
  }, [formValues.fromChain, formValues.fromToken, sourceChainTokenParam]);

  const destinationChainToken = useMemo<ChainTokenSelected | undefined>(() => {
    if (formValues.toChain && formValues.toToken) {
      return { chainId: formValues.toChain, tokenAddress: formValues.toToken };
    }
    if (
      destinationChainTokenParam?.chainId &&
      destinationChainTokenParam?.token
    ) {
      return {
        chainId: destinationChainTokenParam.chainId,
        tokenAddress: destinationChainTokenParam.token,
      };
    }
    return undefined;
  }, [formValues.toChain, formValues.toToken, destinationChainTokenParam]);

  const isEvmSourceChain = useMemo(() => {
    return (
      sourceChainToken?.chainId &&
      getChainById(sourceChainToken.chainId)?.chainType === ChainType.EVM
    );
  }, [sourceChainToken, getChainById]);

  const isEvmDestinationChain = useMemo(() => {
    return (
      destinationChainToken?.chainId &&
      getChainById(destinationChainToken.chainId)?.chainType === ChainType.EVM
    );
  }, [destinationChainToken, getChainById]);

  // Bridge condition checks
  const bridgeConditions = useMemo(() => {
    const isBridgeFromHypeToArbNativeUSDC =
      sourceChainToken?.chainId === (998 as ChainId) &&
      destinationChainToken?.chainId === ChainId.ARB &&
      destinationChainToken?.tokenAddress === ARB_NATIVE_USDC;

    const isBridgeFromEvmToHype =
      destinationChainToken?.chainId === (998 as ChainId) && isEvmSourceChain;

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
    sourceChainToken?.chainId,
    destinationChainToken?.chainId,
    destinationChainToken?.tokenAddress,
    isEvmSourceChain,
    isConnectedAGW,
  ]);

  useEffect(() => {
    const handleFormFieldChanged = (fieldChange: FormFieldChanged) => {
      if (!fieldChange || !formRef?.current) return;

      // Update form values
      setFormValues((prev) => ({
        ...prev,
        [fieldChange.fieldName]: fieldChange.newValue,
      }));

      // Handle AGW address check
      if (
        isConnectedAGW &&
        fieldChange.fieldName === 'toAddress' &&
        fieldChange.newValue === account.address
      ) {
        formRef.current.setFieldValue('toAddress', undefined, {
          setUrlSearchParam: true,
        });
        return;
      }

      // Handle bridge conditions
      const isBridgeFromHypeToArbNativeUSDC =
        fieldChange.fieldName === 'fromChain' &&
        fieldChange.newValue === (998 as ChainId) &&
        formValues.toChain === ChainId.ARB &&
        formValues.toToken === ARB_NATIVE_USDC;

      const isBridgeFromEvmToHype =
        fieldChange.fieldName === 'toChain' &&
        fieldChange.newValue === (998 as ChainId) &&
        isEvmSourceChain;

      if (isBridgeFromHypeToArbNativeUSDC || isBridgeFromEvmToHype) {
        formRef.current.setFieldValue('toAddress', undefined, {
          setUrlSearchParam: true,
        });
      }
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
    isEvmSourceChain,
  ]);

  return {
    sourceChainToken: sourceChainToken
      ? { ...sourceChainToken, isEvm: isEvmSourceChain }
      : undefined,
    destinationChainToken: destinationChainToken
      ? {
          ...destinationChainToken,
          isEvm: isEvmDestinationChain,
        }
      : undefined,
    toAddress,
    bridgeConditions,
  };
};

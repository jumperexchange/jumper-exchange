import { useEffect, useMemo, useState } from 'react';
import { useUrlParams } from './useUrlParams';
import {
  type ChainTokenSelected,
  type FormFieldChanged,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import { useChains } from './useChains';

export const useWidgetSelectedChains = () => {
  const {
    sourceChainToken: sourceChainTokenParam,
    destinationChainToken: destinationChainTokenParam,
  } = useUrlParams();

  const { getChainById } = useChains();
  const widgetEvents = useWidgetEvents();

  const [fromChainTokenValue, setFromChainTokenValue] = useState<{
    fromChain?: number;
    fromToken?: string;
  }>({
    fromChain: sourceChainTokenParam?.chainId,
    fromToken: sourceChainTokenParam?.token,
  });

  const [toChainTokenValue, setToChainTokenValue] = useState<{
    toChain?: number;
    toToken?: string;
  }>({
    toChain: destinationChainTokenParam?.chainId,
    toToken: destinationChainTokenParam?.token,
  });

  const sourceChainToken = useMemo<ChainTokenSelected | undefined>(() => {
    if (fromChainTokenValue.fromChain && fromChainTokenValue.fromToken) {
      return {
        chainId: fromChainTokenValue.fromChain,
        tokenAddress: fromChainTokenValue.fromToken,
      };
    }
    if (sourceChainTokenParam?.chainId && sourceChainTokenParam?.token) {
      return {
        chainId: sourceChainTokenParam.chainId,
        tokenAddress: sourceChainTokenParam.token,
      };
    }
    return undefined;
  }, [
    fromChainTokenValue.fromChain,
    fromChainTokenValue.fromToken,
    sourceChainTokenParam,
  ]);

  const sourceChainType = useMemo(() => {
    if (!sourceChainToken?.chainId) {
      return undefined;
    }
    return getChainById(sourceChainToken.chainId)?.chainType;
  }, [sourceChainToken?.chainId, getChainById]);

  const destinationChainToken = useMemo<ChainTokenSelected | undefined>(() => {
    if (toChainTokenValue.toChain && toChainTokenValue.toToken) {
      return {
        chainId: toChainTokenValue.toChain,
        tokenAddress: toChainTokenValue.toToken,
      };
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
  }, [
    toChainTokenValue.toChain,
    toChainTokenValue.toToken,
    destinationChainTokenParam,
  ]);

  const destinationChainType = useMemo(() => {
    if (!destinationChainToken?.chainId) {
      return undefined;
    }
    return getChainById(destinationChainToken.chainId)?.chainType;
  }, [destinationChainToken?.chainId, getChainById]);

  console.log(sourceChainToken, sourceChainType);

  useEffect(() => {
    const handleFormFieldChanged = (fieldChange: FormFieldChanged) => {
      if (!fieldChange) return;

      if (
        fieldChange.fieldName === 'fromChain' ||
        fieldChange.fieldName === 'fromToken'
      ) {
        setFromChainTokenValue((prev) => ({
          ...prev,
          [fieldChange.fieldName]: fieldChange.newValue,
        }));
      }

      if (
        fieldChange.fieldName === 'toChain' ||
        fieldChange.fieldName === 'toToken'
      ) {
        setToChainTokenValue((prev) => ({
          ...prev,
          [fieldChange.fieldName]: fieldChange.newValue,
        }));
      }
    };

    widgetEvents.on(WidgetEvent.FormFieldChanged, handleFormFieldChanged);
    return () => {
      widgetEvents.off(WidgetEvent.FormFieldChanged, handleFormFieldChanged);
    };
  }, [widgetEvents]);

  return {
    sourceChainToken: {
      chainId: sourceChainToken?.chainId,
      tokenAddress: sourceChainToken?.tokenAddress,
      chainType: sourceChainType,
    },
    destinationChainToken: {
      chainId: destinationChainToken?.chainId,
      tokenAddress: destinationChainToken?.tokenAddress,
      chainType: destinationChainType,
    },
  };
};

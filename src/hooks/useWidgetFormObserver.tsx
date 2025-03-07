import type { Account } from '@lifi/wallet-management';
import type { FormFieldChanged, FormState } from '@lifi/widget';
import { ChainId, useWidgetEvents, WidgetEvent } from '@lifi/widget';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import type { PartnerThemeConfig } from 'src/types/PartnerThemeConfig';

interface ChainToken {
  chainId: string | null;
  token: string | null;
}

interface ChainTokenSelection {
  sourceChainToken: ChainToken;
  destinationChainToken: ChainToken;
}

interface UseWidgetFormObserverProps {
  formRef: RefObject<FormState>;
  account: Account;
  wrapperRef: RefObject<HTMLDivElement>;
  configTheme: Partial<PartnerThemeConfig>;
  allowToChains?: number[] | undefined;
}

export const useWidgetFormObserver = ({
  formRef,
  account,
  wrapperRef,
  configTheme,
  allowToChains,
}: UseWidgetFormObserverProps) => {
  const [chainTokenSelection, setChainTokenSelection] =
    useState<ChainTokenSelection>({
      sourceChainToken: {
        chainId: null,
        token: null,
      },
      destinationChainToken: {
        chainId: null,
        token: null,
      },
    });
  const widgetEvents = useWidgetEvents();
  const isConnectedAGW = account?.connector?.name === 'Abstract';

  useEffect(() => {
    const queryParameters =
      typeof window !== 'undefined' &&
      window?.location &&
      new URLSearchParams(window.location.search);
    if (queryParameters) {
      const fromChain = queryParameters.get('fromChain');
      const fromToken = queryParameters.get('fromToken');
      const toChain = queryParameters.get('toChain');
      const toToken = queryParameters.get('toToken');
      setChainTokenSelection({
        sourceChainToken: {
          chainId: fromChain ? fromChain : null,
          token: fromToken || null,
        },
        destinationChainToken: {
          chainId: toChain ? toChain : null,
          token: toToken || null,
        },
      });
    }
  }, []);

  useEffect(() => {
    // Our partners that want to onboard on pre-filled address can still do it
    if (
      !wrapperRef.current ||
      configTheme?.chains?.to?.allow?.includes(2741) ||
      allowToChains?.includes(2741)
    ) {
      return;
    }
    // Clear toAddress URL parameter once the widget is mounted
    // Uses MutationObserver to detect when the widget content is loaded
    // since it's rendered dynamically inside WidgetWrapper
    const observer = new MutationObserver(() => {
      if (formRef.current) {
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
  }, [allowToChains, configTheme?.chains?.to?.allow, formRef, wrapperRef]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (formRef.current) {
        formRef.current.setFieldValue('toAddress', undefined, {
          setUrlSearchParam: true,
        });
        observer.disconnect();
      }
    });

    if (account.chainId === ChainId.ABS) {
      if (
        chainTokenSelection.destinationChainToken.chainId !==
        String(ChainId.ABS)
      ) {
        formRef.current?.setFieldValue('toAddress', undefined, {
          setUrlSearchParam: true,
        });
      }
    }

    const handleAGW = async (fieldChange: FormFieldChanged) => {
      if (isConnectedAGW) {
        if (
          chainTokenSelection.destinationChainToken.chainId !==
            String(ChainId.ABS) &&
          fieldChange?.fieldName === 'toAddress' &&
          fieldChange?.newValue === account.address
        ) {
          formRef.current?.setFieldValue('toAddress', undefined, {
            setUrlSearchParam: true,
          });
        }
        if (
          fieldChange?.fieldName === 'toChain' &&
          fieldChange?.newValue === 2741
        ) {
          setChainTokenSelection((state) => {
            return {
              ...state,
              destinationChainToken: {
                ...state.destinationChainToken,
                chainId: String(2741),
              },
            };
          });
        }
      }
    };

    widgetEvents.on(WidgetEvent.FormFieldChanged, handleAGW);
    return () => {
      widgetEvents.off(WidgetEvent.FormFieldChanged, handleAGW);
    };
  }, [
    account.address,
    account.chainId,
    chainTokenSelection.destinationChainToken.chainId,
    formRef,
    isConnectedAGW,
    widgetEvents,
  ]);
  return { chainTokenSelection, formRef };
};

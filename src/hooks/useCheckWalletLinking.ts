import type { Chain, ChainId, ExtendedChain } from '@lifi/types';
import { useQuery } from '@tanstack/react-query';
import { ChainType, getChains } from '@lifi/sdk';

export interface useCheckWalletLinkingProps {
  userAddress?: string;
  checkWalletLinking: boolean;
}

export interface WalletLinkCheckProps {
  isSuccess: boolean;
  isWalletLinked?: boolean;
}

export const useCheckWalletLinking = ({
  userAddress,
  checkWalletLinking,
}: useCheckWalletLinkingProps): WalletLinkCheckProps => {
  const POST_ENDPOINT = 'https://li.quest/v1/advanced/routes';
  const {
    data: isWalletLinked,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['SeiWalletLinking' + userAddress],
    queryFn: async () => {
      const payload = {
        fromAddress: userAddress,
        fromAmount: '1000000000000000000',
        fromChainId: 1329,
        fromTokenAddress: '0x0000000000000000000000000000000000000000',
        toChainId: 1329,
        toTokenAddress: '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7',
        options: {
          integrator: 'check.jmp.exchange',
          order: 'CHEAPEST',
          slippage: 0.005,
          maxPriceImpact: 0.4,
          allowSwitchChain: true,
        },
      };
      const res = await fetch(POST_ENDPOINT, {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        return false;
      }
      const data = await res.json();

      const errorReason = data?.unavailableRoutes?.filteredOut?.[0].reason;
      const isSeiErrorMessage = String(errorReason).includes(
        'wallet is not linked to the original SEI address, please go to https://app.sei.io/',
      );
      const walletIsNotLink = isSeiErrorMessage && data?.routes.length === 0;

      if (data && !walletIsNotLink) {
        return true;
      }
      return false;
    },
    enabled: !!userAddress && checkWalletLinking,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    isWalletLinked,
    isSuccess,
  };
};

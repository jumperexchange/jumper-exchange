import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';

import { PortfolioByAccount } from './PortfolioByAccount';

export function Portfolio() {
  const { queriesByAddress } = usePortfolioTokens();

  return (
    <>
      {Array.from(queriesByAddress.entries()).map(
        ([walletAddress, account]) => (
          <PortfolioByAccount
            key={walletAddress}
            walletAddress={walletAddress}
            refetch={account.refetch}
            isFetching={account.isFetching}
            isSuccess={account.isSuccess}
            data={account.data ?? []}
          />
        ),
      )}
    </>
  );
}

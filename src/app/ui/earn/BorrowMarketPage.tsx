import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { getLoopoorMarket } from 'src/app/lib/getLoopoorMarket';
import { BorrowDetailsChart } from 'src/components/EarnDetails/BorrowDetailsChart';
import { BorrowDetailsIntro } from 'src/components/EarnDetails/BorrowDetailsIntro';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';
import { GoBack } from 'src/components/composite/GoBack/GoBack';
import { AppPaths } from 'src/const/urls';
import { getChainsQuery } from 'src/hooks/useChains';
import { getChainById } from 'src/utils/tokenAndChain';
import { transformLoopoorMarketToOpportunity } from 'src/utils/loopoor/transformLoopoorMarket';
import type { ChainId } from '@lifi/sdk';

interface BorrowMarketPageProps {
  chainId: number;
  marketId: string;
}

export const BorrowMarketPage: FC<BorrowMarketPageProps> = async ({
  chainId,
  marketId,
}) => {
  const result = await getLoopoorMarket(chainId, marketId).catch((error) => {
    console.error('getLoopoorMarket failed', chainId, marketId, error);
    return { ok: false as const, data: undefined, error };
  });

  if (!result.ok || !result.data) {
    return notFound();
  }

  console.log('26. BorrowMarketPage market data', result.data);

  const { chains } = await getChainsQuery().catch(() => ({ chains: [] }));
  const chain = getChainById(chains, chainId as ChainId);
  const chainKey = chain?.key ?? String(chainId);

  const opportunity = transformLoopoorMarketToOpportunity(
    //@ts-ignore - TODO: LF-14853: type this properly
    result.data.data,
    chainKey,
  );

  return (
    <>
      <EarnDetailsSection>
        <GoBack path={AppPaths.Earn} dataTestId="borrow-back-button" />
        <BorrowDetailsIntro opportunity={opportunity} marketId={marketId} />
        <BorrowDetailsChart />
      </EarnDetailsSection>
    </>
  );
};

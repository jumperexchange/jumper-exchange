'use client';
import { EarnCard } from '../Cards/EarnCard/EarnCard';
import Typography from '@mui/material/Typography';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { FC } from 'react';
import { DepositFlowButton } from '../composite/DepositFlow/DepositFlow';
import { DepositButtonDisplayMode } from '../composite/DepositButton/DepositButton.types';
import {
  EarnRelatedMarketsContainer,
  EarnRelatedMarketWrapper,
} from './EarnRelatedMarkets.styles';
import { useTranslation } from 'react-i18next';
import { AppPaths } from 'src/const/urls';

interface EarnRelatedMarketsProps {
  relatedMarkets: EarnOpportunityWithLatestAnalytics[];
}

export const EarnRelatedMarkets: FC<EarnRelatedMarketsProps> = ({
  relatedMarkets,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="titleSmall">
        {t('earn.relatedMarkets.title')}
      </Typography>
      <EarnRelatedMarketsContainer direction="row" spacing={3}>
        {relatedMarkets.map((relatedMarket) => (
          <EarnRelatedMarketWrapper key={relatedMarket.slug}>
            <EarnCard
              variant="compact"
              href={`${AppPaths.Earn}/${relatedMarket.slug}`}
              data={relatedMarket}
              primaryAction={
                <DepositFlowButton
                  // TODO: Enable deposit flow button and properly set earnOpportunity
                  earnOpportunity={{
                    ...relatedMarket,
                    minFromAmountUSD: 5,
                    positionUrl: relatedMarket.url ?? 'unset',
                    address: relatedMarket.lpToken.address,
                  }}
                  displayMode={DepositButtonDisplayMode.IconOnly}
                  size="large"
                  disabled
                />
              }
            />
          </EarnRelatedMarketWrapper>
        ))}
      </EarnRelatedMarketsContainer>
    </>
  );
};

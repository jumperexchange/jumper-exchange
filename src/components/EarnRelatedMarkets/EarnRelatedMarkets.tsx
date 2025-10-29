'use client';
import { EarnCard } from '../Cards/EarnCard/EarnCard';
import Typography from '@mui/material/Typography';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { FC } from 'react';
import { DepositFlowButton } from '../composite/DepositFlow/DepositFlow';
import { DepositButtonDisplayMode } from '../composite/DepositButton/DepositButton.types';
import { useTranslation } from 'react-i18next';
import { AppPaths } from 'src/const/urls';
import { GridContainer } from '../Containers/GridContainer';
import { AnimatePresence, motion } from 'framer-motion';

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
      <GridContainer
        gridTemplateColumns="repeat(auto-fill, minmax(328px, 1fr))"
        gap={3}
        justifyContent="space-evenly"
      >
        <AnimatePresence mode="popLayout">
          {relatedMarkets.map((relatedMarket) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={relatedMarket.slug}
            >
              <EarnCard
                key={relatedMarket.slug}
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
            </motion.div>
          ))}
        </AnimatePresence>
      </GridContainer>
    </>
  );
};

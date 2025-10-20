'use client';
import { Grid } from '@mui/material';
import { AtLeastNWhenLoading } from 'src/utils/earn/utils';
import { HeroEarnCard } from 'src/components/Cards/HeroEarnCard/HeroEarnCard';
import { useEarnTopOpportunities } from 'src/hooks/earn/useEarnTopOpportunities';
import { DepositButtonDisplayMode } from 'src/components/composite/DepositButton/DepositButton.types';
import { DepositFlowButton } from 'src/components/composite/DepositFlow/DepositFlow';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ithCopy } from 'src/components/Cards/HeroEarnCard/utils';
import { AppPaths } from 'src/const/urls';

interface EarnTopOpportunities {}

export const EarnTopOpportunities = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { data, isLoading, error, isError } = useEarnTopOpportunities({});
  const items = AtLeastNWhenLoading(data, isLoading, 2);
  const isSingleItem = items?.length === 1;

  return (
    <Grid container spacing={2}>
      {items?.map((item, index) => {
        const isMain = index === 0;
        return (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: isSingleItem ? 12 : index === 0 ? 7 : 5,
            }}
            sx={{ display: 'flex' }}
          >
            {item == null ? (
              <HeroEarnCard key={index} isLoading={true} data={null} />
            ) : (
              <HeroEarnCard
                key={item.slug}
                href={`${AppPaths.Earn}/${item.slug}`}
                isLoading={isLoading}
                data={item}
                copy={ithCopy(index)}
                isMain={isMain}
                primaryAction={
                  <DepositFlowButton
                    // TODO: Enable deposit flow button and properly set earnOpportunity
                    earnOpportunity={{
                      ...item,
                      minFromAmountUSD: 5,
                      positionUrl: item.url ?? 'unset',
                      address: item.lpToken.address,
                    }}
                    displayMode={
                      isMain
                        ? DepositButtonDisplayMode.IconAndLabel
                        : DepositButtonDisplayMode.IconOnly
                    }
                    size="large"
                    fullWidth={isMain && isMobile}
                    disabled
                  />
                }
              />
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

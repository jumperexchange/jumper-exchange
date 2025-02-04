import type { Theme } from '@mui/material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import {
  BerachainMarketHeaderBox,
  BerachainMarketHeaderCards,
  BerachainMarketHeaderCTA,
  BerachainMarketHeaderProgressCardStyles,
  BerachainMarketHeaderSubtitle,
  BerachainMarketHeaderTitle,
  BerachainMarketInfos,
} from './BerachainMarketsHeader.style';
import { useTranslation } from 'react-i18next';
import { BerachainProgressCard } from '../BerachainMarketCard/StatCard/BerachainProgressCard';
import { useBerachainMarketsFilterStore } from '@/components/Berachain/stores/BerachainMarketsFilterStore';

export const BerachainMarketsHeader = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const { t } = useTranslation();

  const { roycoStats } = useBerachainMarketsFilterStore((state) => state);

  return (
    <BerachainMarketHeaderBox>
      <BerachainMarketInfos>
        <BerachainMarketHeaderTitle>
          <Typography variant="urbanistTitleMedium">
            Pre-deposit liquidity into {!isDesktop && ' Berachain'}
          </Typography>
          {isDesktop && (
            <Image
              src={'/berachain/berachain-brand-orange-logo.png'}
              alt={'Berachain brand logo orange'}
              width={203}
              height={40}
            />
          )}
        </BerachainMarketHeaderTitle>
        <BerachainMarketHeaderSubtitle>
          Browse Boyco markets, deposit tokens and earn rewards when Berachain
          launches.
        </BerachainMarketHeaderSubtitle>
        <Link href="/berachain">
          <BerachainMarketHeaderCTA>
            <Typography variant="bodySmallStrong">How does it work?</Typography>
          </BerachainMarketHeaderCTA>
        </Link>
      </BerachainMarketInfos>
      <BerachainMarketHeaderCards>
        <BerachainProgressCard
          title={'Total Value Locked'}
          value={
            roycoStats?.total_tvl
              ? t('format.currency', {
                  value: roycoStats?.total_tvl,
                  notation: 'compact',
                })
              : 'N/A'
          }
          tooltip={'Total amount deposited into Boyco contracts.'}
          sx={BerachainMarketHeaderProgressCardStyles(theme)}
        />
        {/* <BerachainProgressCard
          title={'Total Volume'}
          value={
            data?.total_volume
              ? t('format.currency', {
                  value: data?.total_volume,
                  notation: 'compact',
                })
              : 'N/A'
          }
          tooltip={'This is the total volume done on Boyco.'}
          sx={BerachainMarketHeaderProgressCardStyles(theme)}
        /> */}
      </BerachainMarketHeaderCards>
    </BerachainMarketHeaderBox>
  );
};

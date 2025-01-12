import type { Theme } from '@mui/material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  BerachainMarketHeaderBox,
  BerachainMarketHeaderSubtitle,
  BerachainMarketHeaderTitle,
  BerachainMarketInfos,
} from 'src/components/Berachain/components/BerachainMarkets/BerachainMarketsHeader.style';

export const CampaignHeader = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const { t } = useTranslation();
  //   const { data } = useEnrichedRoycoStats();

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
        {/* <Link href="/berachain">
          <BerachainMarketHeaderCTA>
            <Typography variant="bodySmallStrong">How does it work?</Typography>
          </BerachainMarketHeaderCTA>
        </Link> */}
      </BerachainMarketInfos>
    </BerachainMarketHeaderBox>
  );
};

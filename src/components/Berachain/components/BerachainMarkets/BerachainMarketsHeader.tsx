import type { Theme } from '@mui/material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
import {
  BerachainMarketHeaderBox,
  BerachainMarketHeaderCards,
  BerachainMarketHeaderCTA,
  BerachainMarketHeaderProgressCardStyles,
  BerachainMarketHeaderSubtitle,
  BerachainMarketHeaderTitle,
  BerachainMarketInfos,
} from './BerachainMarketsHeader.style';

export const BerachainMarketsHeader = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

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
          Browse the Boyco markets, deposit your tokens and earn rewards when
          Berachain launches.
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
          value={'$107.07K'}
          tooltip={'This is the total amount in a protocol.'}
          sx={BerachainMarketHeaderProgressCardStyles(theme)}
        />
        <BerachainProgressCard
          title={'Total Volume'}
          value={'$406.82K'}
          tooltip={'This is the total volume done on Boyco.'}
          sx={BerachainMarketHeaderProgressCardStyles(theme)}
        />
      </BerachainMarketHeaderCards>
    </BerachainMarketHeaderBox>
  );
};

import { Box, Typography } from '@mui/material';
import { BerachainMarkets } from '../BerachainMarkets/BerachainMarkets';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
import {
  BerachainOverviewBox,
  BerachainOverviewHeader,
  BerachainOverviewSubtitle,
  BerachainProgressContainer,
} from './BerachainOverview.style';

export const BerachainOverview = () => {
  return (
    <BerachainOverviewBox>
      <BerachainOverviewHeader>
        <Box>
          <Typography variant="urbanistTitleMedium" color={'text.primary'}>
            Pre-mine across markets!
          </Typography>
          <BerachainOverviewSubtitle variant="bodyMedium">
            Pledge your tokens to various Berachain markets and earn incentives.
          </BerachainOverviewSubtitle>
        </Box>
        <BerachainProgressContainer>
          <BerachainProgressCard title={'Total Volume'} value={'$114.45'} />
          <BerachainProgressCard title={'Total Value Locked'} value={'$718k'} />
          <BerachainProgressCard title={'Incentives'} value={'$420k'} />
        </BerachainProgressContainer>
      </BerachainOverviewHeader>
      <BerachainMarkets />
    </BerachainOverviewBox>
  );
};

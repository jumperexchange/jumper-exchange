import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
import {
  BerachainActionBerachainWidget,
  BerachainActionBerachainWidgetWrapper,
  BerachainActionPledgeButton,
  BerachainBadgeAvatar,
  BerachainWidgetDivider,
  BerachainWidgetHeader,
  BerachainWidgetPledgedBox,
  BerachainWidgetPledgedBoxLabel,
  BerachainWidgetSelection,
  BerachainWidgetSelectionBox,
  BerachainWidgetSelectionCard,
  BerachainWidgetSelectionChainLogoSkeleton,
  BerachainWidgetSelectionRewards,
  BerachainWidgetSelectionTokenLogoSkeleton,
} from './BerachainWidget.style';

export const BerachainWidget = () => {
  return (
    <BerachainActionBerachainWidgetWrapper>
      <BerachainActionBerachainWidget>
        <BerachainWidgetHeader>
          <Typography variant="titleSmall">Deposit tokens</Typography>
          <Image
            src="/berachain/berachain-icon-chain.png"
            alt="Berachain icon with chain"
            width={45}
            height={24}
          />
        </BerachainWidgetHeader>
        <BerachainWidgetSelection>
          <Typography variant="title2XSmall">Selected Token</Typography>
          <BerachainWidgetSelectionCard>
            <BerachainWidgetSelectionBox>
              <BerachainBadgeAvatar>
                <BerachainWidgetSelectionTokenLogoSkeleton variant="circular" />
                <BerachainWidgetSelectionChainLogoSkeleton variant="circular" />
              </BerachainBadgeAvatar>
              <Box>
                <Typography variant="bodyLargeStrong">DAI</Typography>
                <Typography variant="bodyXSmall">Ethereum</Typography>
              </Box>
            </BerachainWidgetSelectionBox>
            <ChevronRightIcon />
          </BerachainWidgetSelectionCard>
          <BerachainWidgetDivider />
          <BerachainWidgetSelectionRewards>
            <BerachainProgressCard
              title={'APY'}
              value={'8.22%'}
              tooltip={'APY lorem ipsum tooltip msg'}
            />
            <BerachainProgressCard
              title={'Rewards'}
              value={'$4.45M'}
              tooltip={'Rewards lorem ipsum tooltip msg'}
            />
          </BerachainWidgetSelectionRewards>
        </BerachainWidgetSelection>
        <BerachainWidgetSelection>
          <Typography variant="title2XSmall">Deposit</Typography>
          <Box display={'flex'} alignItems={'center'} marginTop={'8px'}>
            <BerachainWidgetSelectionTokenLogoSkeleton variant="circular" />
            <Typography variant="bodyXLargeStrong" marginLeft={'16px'}>
              2.00
            </Typography>
          </Box>
        </BerachainWidgetSelection>
        <BerachainActionPledgeButton>
          <Typography variant="bodyMediumStrong">Deposit tokens</Typography>
        </BerachainActionPledgeButton>
        <BerachainWidgetDivider sx={{ marginTop: '48px' }} />
        <BerachainWidgetPledgedBox>
          <Box>
            <BerachainWidgetPledgedBoxLabel variant="bodySmallStrong">
              Your deposits
            </BerachainWidgetPledgedBoxLabel>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <BerachainWidgetPledgedBoxLabel variant="bodySmallStrong">
              View all
            </BerachainWidgetPledgedBoxLabel>
            <ArrowForwardIosIcon
              sx={{ width: '16px', height: '16px', marginLeft: '16px' }}
            />
          </Box>
        </BerachainWidgetPledgedBox>
      </BerachainActionBerachainWidget>
    </BerachainActionBerachainWidgetWrapper>
  );
};

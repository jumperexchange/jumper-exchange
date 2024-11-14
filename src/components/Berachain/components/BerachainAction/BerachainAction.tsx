import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { alpha, Box, Skeleton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { ProgressionBar } from '../../../ProfilePage/LevelBox/ProgressionBar';
import { BerachainProgressCard } from '../BerachainProgressCard/BerachainProgressCard';
import {
  BerachainActionBerachainWidget,
  BerachainActionBerachainWidgetWrapper,
  BerachainActionBox,
  BerachainActionContent,
  BerachainActionExamplesBox,
  BerachainActionExamplesContent,
  BerachainActionExamplesIcons,
  BerachainActionLearnMoreCTA,
  BerachainActionPledgeButton,
  BerachainActionSubtitle,
  BerachainActionTitle,
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
} from './BerachainAction.style';

export const BerachainAction = () => {
  const theme = useTheme();
  return (
    <BerachainActionBox>
      <BerachainActionContent>
        <BerachainActionTitle variant="urbanistTitleLarge">
          Pre-mine your tokens
        </BerachainActionTitle>
        <BerachainActionSubtitle variant="urbanistBodyXLarge">
          Pledge your tokens to Berachain and earn rewards post launch! You can
          pledge from five available tokens.
        </BerachainActionSubtitle>
        <BerachainActionSubtitle variant="urbanistBodyXLarge" marginTop={4}>
          Take a look now!
        </BerachainActionSubtitle>
        <BerachainActionLearnMoreCTA>Learn more</BerachainActionLearnMoreCTA>
        <BerachainActionExamplesBox>
          <Typography variant="urbanistBodyLarge">
            Tokens pledged by other Degens
          </Typography>
          <BerachainActionExamplesContent>
            <Typography variant="urbanistBody2XLarge">$2.75M</Typography>
            <BerachainActionExamplesIcons>
              {Array.from({ length: 4 }, (index) => index).map((_, index) => (
                <Skeleton
                  variant="circular"
                  sx={{ width: '28px', height: '28px' }}
                />
              ))}
            </BerachainActionExamplesIcons>
          </BerachainActionExamplesContent>
          <ProgressionBar
            hideLevelIndicator={true}
            ongoingValue={75}
            levelData={{ minPoints: 0, maxPoints: 100 }}
            chartBg={alpha(theme.palette.white.main, 0.2)}
            chartCol={'#F47226'}
          />
        </BerachainActionExamplesBox>
      </BerachainActionContent>
      <BerachainActionBerachainWidgetWrapper>
        <BerachainActionBerachainWidget>
          <BerachainWidgetHeader>
            <Typography variant="interTitleSmall">Pledge Tokens</Typography>
            <Image
              src="/berachain/berachain-icon-chain.png"
              alt="Berachain icon with chain"
              width={45}
              height={24}
            />
          </BerachainWidgetHeader>
          <BerachainWidgetSelection>
            <Typography variant="interTitle2XSmall">Selected Token</Typography>
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
            <Typography variant="interTitle2XSmall">You’re pledging</Typography>
            <Box display={'flex'} alignItems={'center'} marginTop={'8px'}>
              <BerachainWidgetSelectionTokenLogoSkeleton variant="circular" />
              <Typography variant="bodyXLargeStrong" marginLeft={'16px'}>
                2.00
              </Typography>
            </Box>
          </BerachainWidgetSelection>
          <BerachainActionPledgeButton>
            <Typography variant="bodyMediumStrong">
              Pledge more tokens
            </Typography>
          </BerachainActionPledgeButton>
          <BerachainWidgetDivider sx={{ marginTop: '48px' }} />
          <BerachainWidgetPledgedBox>
            <Box>
              <BerachainWidgetPledgedBoxLabel variant="bodySmallStrong">
                Tokens pledged by you
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
    </BerachainActionBox>
  );
};

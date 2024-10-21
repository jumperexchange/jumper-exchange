import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { OptionalLink } from 'src/components/OptionalLink';
import { FlexSpaceBetweenBox } from 'src/components/Superfest/Superfest.style';
import type { Chain } from 'src/components/Superfest/SuperfestPage/Banner/Banner';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import {
  PROFILE_CAMPAIGN_DARK_COLOR,
  PROFILE_CAMPAIGN_FLASHY_APY_COLOR,
  PROFILE_CAMPAIGN_LIGHT_COLOR,
} from 'src/const/partnerRewardsTheme';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import type { OngoingNumericItemStats } from 'src/hooks/useOngoingNumericQuests';
import { useUserTracking } from 'src/hooks/userTracking';
import { Button } from '../../Button';
import { SuperfestXPIcon } from '../../illustrations/XPIcon';
import { ProgressionBar } from '../LevelBox/ProgressionBar';
import {
  BadgeRelativeBox,
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
  XPDisplayBox,
  XPIconBox,
} from './QuestCard.style';
import { XPRewardsInfo } from './XPRewardsInfo';
import { PerpBadge } from 'src/components/illustrations/PerpBadge';
import { OPBadge } from 'src/components/illustrations/OPBadge';

export interface RewardsInterface {
  logo: string;
  name: string;
  amount: number;
}

interface RewardsProgressProps extends OngoingNumericItemStats {
  earnedXP?: number;
}

interface QuestCardProps {
  title?: string;
  image?: string;
  points?: number;
  link?: string;
  startDate?: string;
  action?: string;
  endDate?: string;
  platformName?: string;
  platformImage?: string;
  hideXPProgressComponents?: boolean;
  slug?: string;
  chains?: Chain[];
  rewards?: RewardsInterface;
  completed?: boolean;
  claimingIds?: string[];
  variableWeeklyAPY?: boolean;
  rewardRange?: string;
  rewardsProgress?: RewardsProgressProps;
  label?: string;
  id?: number;
  isUnlocked?: boolean;
}

export const QuestCardDetailled = ({
  title,
  image,
  action,
  points,
  link,
  slug,
  chains,
  completed,
  claimingIds,
  variableWeeklyAPY,
  label,
  id,
  rewardRange,
  rewardsProgress,
  hideXPProgressComponents,
  isUnlocked,
}: QuestCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { apy } = useMissionsMaxAPY(claimingIds);
  const { trackEvent } = useUserTracking();

  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickQuestCard,
      label: 'click-quest-card',
      data: {
        [TrackingEventParameter.QuestCardTitle]: title || '',
        [TrackingEventParameter.QuestCardLabel]: label || '',
        [TrackingEventParameter.QuestCardId]: id || '',
      },
    });
  };

  return (
    <QuestCardMainBox sx={{ height: 'auto' }} onClick={handleClick}>
      <OptionalLink
        ariaLabel={title}
        href={link || (slug && `/quests/${slug}`)}
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {image ? (
            <>
              <Image
                src={image}
                alt="Quest Card Image"
                width={288}
                height={288}
                style={{
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                }}
              />
              <BadgeRelativeBox>
                {isUnlocked ? <OPBadge /> : undefined}
              </BadgeRelativeBox>
            </>
          ) : (
            <Skeleton
              variant="rectangular"
              width={288}
              height={288}
              sx={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
            />
          )}
        </Box>
        <QuestCardBottomBox
          gap={0.75}
          sx={{
            ...(hideXPProgressComponents && { justifyContent: 'flex-start' }),
          }}
        >
          <QuestCardTitleBox>
            {title ? (
              <Typography
                fontSize="20px"
                lineHeight="20px"
                fontWeight={600}
                color={
                  theme.palette.mode === 'dark'
                    ? PROFILE_CAMPAIGN_DARK_COLOR
                    : PROFILE_CAMPAIGN_LIGHT_COLOR
                }
              >
                {title && title.length > 22
                  ? `${title.slice(0, 21)}...`
                  : title}
              </Typography>
            ) : (
              <Skeleton variant="text" width={256} height={20} />
            )}
          </QuestCardTitleBox>

          <FlexSpaceBetweenBox height={'36px'}>
            <FlexCenterRowBox>
              {chains?.map((elem: Chain, i: number) => {
                return (
                  <Image
                    key={elem.name + '-' + i}
                    src={elem.logo}
                    style={{
                      marginLeft: i === 0 ? '' : '-8px',
                      zIndex: 100 - i,
                    }}
                    alt={elem.name}
                    width="32"
                    height="32"
                  />
                );
              })}
              {rewardsProgress?.earnedXP && !chains && (
                <XPRewardsInfo
                  bgColor={'#42B852'}
                  label={`${rewardsProgress?.earnedXP}`}
                  tooltip={t('questCard.earnedXPDescription', {
                    earnedXP: rewardsProgress?.earnedXP,
                    action: action,
                  })}
                  active={true}
                >
                  <XPIconBox marginLeft="4px">
                    <CheckCircleIcon sx={{ width: '16px', color: '#ffffff' }} />
                  </XPIconBox>
                </XPRewardsInfo>
              )}
            </FlexCenterRowBox>
            {points ? (
              <FlexCenterRowBox>
                {apy > 0 && !variableWeeklyAPY && (
                  <XPDisplayBox
                    active={true}
                    bgcolor={PROFILE_CAMPAIGN_FLASHY_APY_COLOR}
                  >
                    <Typography
                      fontSize="14px"
                      fontWeight={700}
                      lineHeight="18px"
                      color={'#ffffff'}
                    >
                      {`${Number(apy).toFixed(1)}%`}
                    </Typography>
                    <XPIconBox marginLeft="4px">
                      <APYIcon size={20} />
                    </XPIconBox>
                  </XPDisplayBox>
                )}
                {variableWeeklyAPY && (
                  <XPDisplayBox
                    active={true}
                    bgcolor={PROFILE_CAMPAIGN_FLASHY_APY_COLOR}
                  >
                    <Typography
                      fontSize="14px"
                      fontWeight={700}
                      lineHeight="18px"
                      color={'#ffffff'}
                    >
                      {rewardRange ? rewardRange : `VAR.%`}
                    </Typography>
                    <XPIconBox marginLeft="4px">
                      <APYIcon size={20} />
                    </XPIconBox>
                  </XPDisplayBox>
                )}
                {!hideXPProgressComponents && (
                  <XPRewardsInfo
                    bgColor={!completed ? '#31007A' : '#42B852'}
                    label={`+${points}`}
                    tooltip={
                      rewardsProgress &&
                      t('questCard.xpToEarnDescription', {
                        xpToEarn: points,
                        action: action,
                      })
                    }
                    active={true}
                  >
                    {!completed ? (
                      <SuperfestXPIcon size={16} />
                    ) : (
                      <CheckCircleIcon
                        sx={{ width: '16px', color: '#ffffff' }}
                      />
                    )}
                  </XPRewardsInfo>
                )}
              </FlexCenterRowBox>
            ) : undefined}
          </FlexSpaceBetweenBox>
          {rewardsProgress && !hideXPProgressComponents && (
            <ProgressionBar
              ongoingValue={rewardsProgress.currentValue}
              loading={false}
              levelData={{
                maxPoints: rewardsProgress.max,
                minPoints: rewardsProgress.min,
              }}
              hideLevelIndicator={true}
            />
          )}
          {slug ? (
            <QuestCardInfoBox>
              <Button
                disabled={false}
                variant="primary"
                size="medium"
                styles={{
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography fontSize="16px" lineHeight="18px" fontWeight={600}>
                  {String(t('questCard.join')).toUpperCase()}
                </Typography>
              </Button>
            </QuestCardInfoBox>
          ) : null}
        </QuestCardBottomBox>
      </OptionalLink>
    </QuestCardMainBox>
  );
};

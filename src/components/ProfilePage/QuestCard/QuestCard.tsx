import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';
import LockIcon from '@mui/icons-material/Lock';
import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { JumperIconDark } from 'src/components/illustrations/JumperIconDark';
import { OptionalLink } from 'src/components/ProfilePage/OptionalLink/OptionalLink';
import type { Chain } from 'src/components/Quests/QuestPage/Banner/Banner';
import { FlexCenterRowBox } from 'src/components/Quests/QuestPage/QuestsMissionPage.style';
import { PROFILE_CAMPAIGN_FLASHY_APY_COLOR } from 'src/const/partnerRewardsTheme';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { useUserTracking } from 'src/hooks/userTracking';
import type { QuestChains } from 'src/types/loyaltyPass';
import { XPIconBox } from '../QuestCardDetailled/QuestCard.style';
import type {
  RewardsInterface,
  RewardsProgressProps,
} from '../QuestCardDetailled/QuestCardDetailled';
import { XPRewardsInfo } from '../QuestCardDetailled/XPRewardsInfo';
import {
  BadgeRelativeBox,
  CompletedBox,
  CompletedTypography,
  QuestCardButtonCta,
  QuestCardButtonCtaLabel,
  QuestCardContent,
  QuestCardImage,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitle,
  QuestCardTitleSkeleton,
} from './QuestCard.style';
import { TraitsBox } from './TraitsBox/TraitsBox';

interface QuestCardProps {
  action?: string;
  active?: boolean;
  chains?: QuestChains[];
  claimingIds?: string[];
  completed?: boolean;
  ctaLink?: string;
  hideXPProgressComponents?: boolean;
  id?: number | string;
  image?: string;
  isTraitsGarded?: boolean;
  isUnlocked?: boolean;
  label?: string;
  points?: number;
  // platformName?: string;
  // platformImage?: string;
  rewards?: RewardsInterface;
  rewardsProgress?: RewardsProgressProps;
  rewardRange?: string;
  title?: string;
  url?: string;
  variableWeeklyAPY?: boolean;
}

export const QuestCard = ({
  action,
  active,
  chains,
  claimingIds,
  completed,
  ctaLink,
  hideXPProgressComponents,
  id,
  image,
  isTraitsGarded,
  isUnlocked,
  label,
  points,
  // platformName,
  // platformImage,
  rewards,
  rewardsProgress,
  rewardRange,
  title,
  url,
  variableWeeklyAPY,
}: QuestCardProps) => {
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
        // [TrackingEventParameter.QuestCardPlatform]: platformName || '',
      },
    });
  };
  return (
    <QuestCardMainBox onClick={handleClick}>
      <OptionalLink
        disabled={isTraitsGarded && !isUnlocked ? true : false}
        ariaLabel={title}
        href={ctaLink}
      >
        {image ? (
          <>
            {isTraitsGarded && (
              <BadgeRelativeBox>
                <TraitsBox trait={'perp_oors'} />
              </BadgeRelativeBox>
            )}
            <QuestCardImage
              src={image}
              loading="lazy"
              alt="Quest Card Image"
              width={288}
              height={288}
            />
          </>
        ) : (
          <Skeleton variant="rectangular" width={'288px'} height={'288px'} />
        )}
        <QuestCardContent>
          {title ? (
            <QuestCardTitle variant="headerSmall">{title}</QuestCardTitle>
          ) : (
            <QuestCardTitleSkeleton variant="rectangular" />
          )}
          <Box>
            <QuestCardInfoBox>
              {chains ? (
                <FlexCenterRowBox>
                  {chains.map((elem: Chain, i: number) => (
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
                  ))}
                </FlexCenterRowBox>
              ) : (
                <JumperIconDark />
              )}
              {rewardsProgress?.earnedXP && !chains && (
                <XPRewardsInfo
                  bgColor={'#42B852'}
                  points={`${rewardsProgress?.earnedXP}`}
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
              {points ? (
                <>
                  {apy > 0 && !variableWeeklyAPY && (
                    <XPRewardsInfo
                      active={true}
                      points={`${Number(apy).toFixed(1)}%`}
                      tooltip={
                        rewardsProgress &&
                        t('questCard.xpToEarnDescription', {
                          xpToEarn: points,
                          action: action,
                        })
                      }
                    >
                      <APYIcon size={20} />
                    </XPRewardsInfo>
                  )}
                  {variableWeeklyAPY && (
                    <XPRewardsInfo
                      active={true}
                      bgColor={PROFILE_CAMPAIGN_FLASHY_APY_COLOR}
                      points={rewardRange ? rewardRange : `VAR.%`}
                      tooltip={
                        rewardsProgress &&
                        t('questCard.xpToEarnDescription', {
                          xpToEarn: points,
                          action: action,
                        })
                      }
                    >
                      <APYIcon size={20} />
                    </XPRewardsInfo>
                  )}
                  {!hideXPProgressComponents && (
                    <XPRewardsInfo
                      completed={completed}
                      points={`+${points}`}
                      tooltip={
                        rewardsProgress &&
                        t('questCard.xpToEarnDescription', {
                          xpToEarn: points,
                          action: action,
                        })
                      }
                      active={true}
                    />
                  )}
                </>
              ) : undefined}
            </QuestCardInfoBox>
            {active ? (
              <QuestCardButtonCta aria-label={`Open ${t('questCard.join')}`}>
                {isTraitsGarded && !isUnlocked && (
                  <LockIcon sx={{ height: '16px', width: '16px' }} />
                )}
                <QuestCardButtonCtaLabel variant="bodyXSmallStrong">
                  {isTraitsGarded && !isUnlocked
                    ? 'Unlocked for perp_oors'
                    : t('questCard.join')}
                </QuestCardButtonCtaLabel>
              </QuestCardButtonCta>
            ) : (
              <CompletedBox>
                <DoneIcon
                  sx={{ width: '16px', height: '16px', color: '#00B849' }}
                />
                <CompletedTypography variant="bodyXSmallStrong">
                  {t('questCard.completed')}
                </CompletedTypography>
              </CompletedBox>
            )}
          </Box>
        </QuestCardContent>
      </OptionalLink>
    </QuestCardMainBox>
  );
};

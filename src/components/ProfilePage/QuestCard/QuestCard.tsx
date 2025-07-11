import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';
import LockIcon from '@mui/icons-material/Lock';
import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { OptionalLink } from 'src/components/ProfilePage/OptionalLink/OptionalLink';
import type { Chain } from 'src/components/QuestPage/Banner/Banner';
import { FlexCenterRowBox } from 'src/components/QuestPage/QuestsMissionPage.style';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import type { OngoingNumericItemStats } from 'src/hooks/useOngoingNumericQuests';
import { useUserTracking } from 'src/hooks/userTracking';
import type { QuestChains } from 'src/types/loyaltyPass';
import { formatMonthDayDateShort } from 'src/utils/formatDate';
import { ProgressionBar } from '../LevelBox/ProgressionBar';
import {
  BadgeRelativeBox,
  CompletedBox,
  CompletedTypography,
  QuestCardButtonCta,
  QuestCardButtonCtaLabel,
  QuestCardButtonSkeleton,
  QuestCardContent,
  QuestCardImage,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitle,
  QuestCardTitleSkeleton,
  RewardsWrapper,
} from './QuestCard.style';
import { TraitsBox } from './TraitsBox/TraitsBox';
import { XPRewardsInfo } from './XPRewardsInfo';

export interface RewardsInterface {
  logo: string;
  name: string;
  amount: number;
}

export interface RewardsProgressProps extends OngoingNumericItemStats {
  earnedXP?: number;
}

export interface QuestCardProps {
  action?: string;
  active?: boolean;
  chains?: QuestChains[];
  completed?: boolean;
  ctaLink?: string;
  hideXPProgressComponents?: boolean;
  id?: number | string;
  image?: string;
  isLoading?: boolean;
  isTraitsGarded?: boolean;
  isUnlocked?: boolean;
  label?: string;
  points?: number;
  startDate?: string;
  endDate?: string;
  rewards?: RewardsInterface;
  rewardsProgress?: RewardsProgressProps;
  rewardRange?: string;
  title?: string;
  variableWeeklyAPY?: boolean;
  maxApy?: number;
}

interface QuestCardDataProps {
  data: QuestCardProps;
}

export const QuestCard = ({ data }: QuestCardDataProps) => {
  const {
    action,
    active,
    chains,
    completed,
    ctaLink,
    endDate,
    hideXPProgressComponents,
    id,
    image,
    isLoading,
    isTraitsGarded,
    isUnlocked,
    label,
    points,
    rewardsProgress,
    rewardRange,
    startDate,
    title,
    variableWeeklyAPY,
    maxApy,
  } = data;

  const { t } = useTranslation();
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

  const rewardsQuestCard = rewardsProgress?.earnedXP && !chains;
  let buttonLabel = `${t('questCard.join')}`;
  if (isTraitsGarded && !isUnlocked) {
    buttonLabel = 'Unlocked for perp_oors';
  } else if (startDate && endDate) {
    buttonLabel = `${formatMonthDayDateShort(startDate)} - ${formatMonthDayDateShort(endDate)}`;
  } else if (rewardsQuestCard) {
    const daysLeft = rewardsProgress.max - rewardsProgress.currentValue;
    buttonLabel = `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
  }

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
            <QuestCardTitle variant="titleXSmall">{title}</QuestCardTitle>
          ) : (
            <QuestCardTitleSkeleton variant="rectangular" />
          )}
          <Box>
            <QuestCardInfoBox>
              {!isLoading ? (
                <>
                  {chains && (
                    <FlexCenterRowBox>
                      {chains.map((elem: Chain, i: number) => (
                        <Image
                          key={elem.name + '-' + i}
                          src={elem.logo}
                          style={{
                            marginLeft: i === 0 ? '' : '-8px',
                            zIndex: 100 - i,
                            borderRadius: '50%',
                          }}
                          alt={elem.name}
                          width="32"
                          height="32"
                        />
                      ))}
                    </FlexCenterRowBox>
                  )}
                </>
              ) : (
                <Skeleton variant="circular" width={'32px'} height={'32px'} />
              )}

              <RewardsWrapper>
                {rewardsQuestCard && (
                  <XPRewardsInfo
                    variant="completed"
                    label={`${rewardsProgress?.earnedXP}`}
                    tooltip={t('questCard.earnedXPDescription', {
                      earnedXP: rewardsProgress?.earnedXP,
                      action: action,
                    })}
                  >
                    <CheckCircleIcon
                      sx={{ width: '20px', height: '20px', color: 'inherit' }}
                    />
                  </XPRewardsInfo>
                )}
                {points || variableWeeklyAPY || maxApy ? (
                  <>
                    {
                      // Enable to show XP (points) badge
                      points && (
                        <XPRewardsInfo
                          variant="xp"
                          label={points.toString()} //points={`${Number(apy).toFixed(1)}%`}
                          tooltip={
                            rewardsProgress &&
                            t('questCard.xpToEarnDescription', {
                              xpToEarn: points,
                              action: action,
                            })
                          }
                        />
                      )
                    }
                    {!!maxApy && maxApy > 0 && !variableWeeklyAPY && (
                      <XPRewardsInfo
                        variant="apy"
                        label={`${Number(maxApy).toFixed(1)}%`} //points={`${Number(apy).toFixed(1)}%`}
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
                        variant="variableWeeklyAPY"
                        label={rewardRange ? rewardRange : `VAR.%`}
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
                        variant="completed"
                        label={`+${points}`}
                        tooltip={
                          rewardsProgress &&
                          t('questCard.xpToEarnDescription', {
                            xpToEarn: points,
                            action: action,
                          })
                        }
                      />
                    )}
                  </>
                ) : undefined}
              </RewardsWrapper>
            </QuestCardInfoBox>

            {!active && !completed && !rewardsQuestCard && (
              <QuestCardButtonSkeleton variant="rectangular" />
            )}
            {active && (
              <QuestCardButtonCta aria-label={`Open ${t('questCard.join')}`}>
                {isTraitsGarded && !isUnlocked && (
                  <LockIcon sx={{ height: '16px', width: '16px' }} />
                )}
                <QuestCardButtonCtaLabel
                  variant="bodyXSmallStrong"
                  sx={isTraitsGarded && !isUnlocked ? { margin: '0 8px' } : {}}
                >
                  {buttonLabel}
                </QuestCardButtonCtaLabel>
              </QuestCardButtonCta>
            )}
            {rewardsQuestCard && (
              <ProgressionBar
                ongoingValue={rewardsProgress.currentValue}
                loading={false}
                label={buttonLabel}
                levelData={{
                  maxPoints: rewardsProgress.max,
                  minPoints: rewardsProgress.min,
                }}
                hideLevelIndicator={true}
              />
            )}
            {completed && (
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

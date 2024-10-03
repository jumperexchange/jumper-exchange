import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { Link } from 'src/components/Link';
import { FlexSpaceBetweenBox } from 'src/components/Superfest/Superfest.style';
import type { Chain } from 'src/components/Superfest/SuperfestPage/Banner/Banner';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import {
  PROFILE_CAMPAIGN_DARK_COLOR,
  PROFILE_CAMPAIGN_FLASHY_APY_COLOR,
  PROFILE_CAMPAIGN_LIGHT_COLOR,
} from 'src/const/partnerRewardsTheme';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import type { OngoingNumericItemStats } from 'src/hooks/useOngoingNumericQuests';
import { formatDecimal } from 'src/utils/formatDecimals';
import { Button } from '../../Button';
import { SuperfestXPIcon } from '../../illustrations/XPIcon';
import { ProgressionBar } from '../LevelBox/ProgressionBar';
import {
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
  XPDisplayBox,
  XPIconBox,
} from './QuestCard.style';

export interface RewardsInterface {
  logo: string;
  name: string;
  amount: number;
}

interface QuestCardProps {
  active?: boolean;
  title?: string;
  image?: string;
  points?: number;
  link?: string;
  startDate?: string;
  endDate?: string;
  platformName?: string;
  platformImage?: string;
  slug?: string;
  chains?: Chain[];
  rewards?: RewardsInterface;
  completed?: boolean;
  claimingIds?: string[];
  variableWeeklyAPY?: boolean;
  rewardRange?: string;
  rewardsProgress?: OngoingNumericItemStats;
}

export const QuestCardDetailled = ({
  active,
  title,
  image,
  points,
  link,
  slug,
  chains,
  completed,
  claimingIds,
  variableWeeklyAPY,
  rewardRange,
  rewardsProgress,
}: QuestCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { apy } = useMissionsMaxAPY(claimingIds);
  return (
    <QuestCardMainBox>
      <Link alt={title} url={link || (slug && `/quests/${slug}`)}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {image ? (
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
          ) : (
            <Skeleton variant="rectangular" width={288} height={288} />
          )}
        </Box>
        <QuestCardBottomBox>
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

          <FlexSpaceBetweenBox
            marginBottom={'8px'}
            marginTop={'8px'}
            minHeight={'32px'}
          >
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
            </FlexCenterRowBox>
            {points ? (
              <FlexCenterRowBox>
                {apy > 0 && !variableWeeklyAPY && (
                  <XPDisplayBox
                    active={active}
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
                    active={active}
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
                <XPDisplayBox
                  active={active}
                  bgcolor={!completed ? '#31007A' : '#42B852'}
                >
                  <Typography
                    fontSize="14px"
                    fontWeight={700}
                    lineHeight="18px"
                    color={'#ffffff'}
                  >
                    {`${formatDecimal(points)}`}
                  </Typography>
                  <XPIconBox marginLeft="4px">
                    {!completed ? (
                      <SuperfestXPIcon size={16} />
                    ) : (
                      <CheckCircleIcon
                        sx={{ width: '16px', color: '#ffffff' }}
                      />
                    )}
                  </XPIconBox>
                </XPDisplayBox>
              </FlexCenterRowBox>
            ) : undefined}
          </FlexSpaceBetweenBox>
          {rewardsProgress && (
            <ProgressionBar
              points={points}
              levelData={{
                maxPoints: rewardsProgress.max,
                minPoints: rewardsProgress.min,
              }}
              hideIndicator={true}
            />
          )}
          <QuestCardInfoBox points={points}>
            {active && slug ? (
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
            ) : null}
          </QuestCardInfoBox>
        </QuestCardBottomBox>
      </Link>
    </QuestCardMainBox>
  );
};

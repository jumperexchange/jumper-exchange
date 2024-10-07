import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { useUserTracking } from 'src/hooks/userTracking';
import { ButtonSecondary } from '../../Button';
import { XPIcon } from '../../illustrations/XPIcon';
import type { Chain } from '../QuestPage/Banner/Banner';
import { FlexCenterRowBox } from '../QuestPage/QuestsMissionPage.style';
import { FlexSpaceBetweenBox } from '../Quests.style';
import {
  QuestPageCardBottomBox,
  QuestPageCardInfoBox,
  QuestPageCardMainBox,
  QuestPageCardTitleBox,
  XPDisplayBox,
  XPIconBox,
} from './QuestPageCard.style';

export interface RewardsInterface {
  logo: string;
  name: string;
  amount: number;
}

interface QuestPageCardProps {
  active?: boolean;
  title?: string;
  image?: string;
  points?: number;
  path: string;
  link?: string;
  id?: string | number;
  label?: string;
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
}

export const QuestPageCard = ({
  active,
  title,
  image,
  points,
  id,
  path,
  label,
  link,
  startDate,
  endDate,
  slug,
  chains,
  rewards,
  completed,
  claimingIds,
  variableWeeklyAPY,
  rewardRange,
}: QuestPageCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { apy } = useMissionsMaxAPY(claimingIds);

  const { trackEvent } = useUserTracking();
  const handleClick = () => {
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickQuestCard,
      label: 'click-quest-card',
      data: {
        [TrackingEventParameter.QuestCardTitle]: title || '',
        [TrackingEventParameter.QuestCardId]: id || '',
        [TrackingEventParameter.QuestCardLabel]: label || '',
      },
    });
  };

  return (
    <QuestPageCardMainBox>
      <Link onClick={handleClick} href={`${path}${slug}`}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {image && (
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
          )}
        </Box>
      </Link>
      <QuestPageCardBottomBox>
        <QuestPageCardTitleBox>
          <Typography fontSize="20px" lineHeight="20px" fontWeight={600}>
            {title && title.length > 22 ? `${title.slice(0, 21)}...` : title}
          </Typography>
        </QuestPageCardTitleBox>
        <FlexSpaceBetweenBox marginBottom={'8px'} marginTop={'8px'}>
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
                  bgcolor={theme.palette.primary.main}
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
                  bgcolor={theme.palette.primary.main}
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
                  {`${points}`}
                </Typography>
                <XPIconBox marginLeft="4px">
                  {!completed ? (
                    <XPIcon size={16} />
                  ) : (
                    <CheckCircleIcon sx={{ width: '16px', color: '#ffffff' }} />
                  )}
                </XPIconBox>
              </XPDisplayBox>
            </FlexCenterRowBox>
          ) : undefined}
        </FlexSpaceBetweenBox>
        <QuestPageCardInfoBox points={points}>
          {active && slug ? (
            <ButtonSecondary
              disabled={false}
              size="medium"
              onClick={() => router.push(slug)}
            >
              <Typography fontSize="16px" lineHeight="18px" fontWeight={600}>
                {String(t('questCard.join')).toUpperCase()}
              </Typography>
            </ButtonSecondary>
          ) : null}
        </QuestPageCardInfoBox>
      </QuestPageCardBottomBox>
    </QuestPageCardMainBox>
  );
};

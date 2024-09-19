import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { OPBadge } from 'src/components/illustrations/OPBadge';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { useUserTracking } from 'src/hooks/userTracking';
import { Button } from '../../Button';
import { SuperfestXPIcon } from '../../illustrations/XPIcon';
import { FlexSpaceBetweenBox, SoraTypography } from '../Superfest.style';
import type { Chain } from '../SuperfestPage/Banner/Banner';
import { FlexCenterRowBox } from '../SuperfestPage/SuperfestMissionPage.style';
import {
  OPBadgeRelativeBox,
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
  id?: string | number;
  points?: number;
  label?: string;
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
}
export const QuestCard = ({
  active,
  title,
  image,
  id,
  points,
  label,
  slug,
  chains,
  rewards,
  completed,
  claimingIds,
  variableWeeklyAPY,
  rewardRange,
}: QuestCardProps) => {
  const { t } = useTranslation();
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
        [TrackingEventParameter.QuestCardPlatform]: 'superfest',
        [TrackingEventParameter.QuestCardLabel]: label || '',
      },
    });
  };
  return (
    <QuestCardMainBox>
      <Link href={`/superfest/${slug}`} onClick={handleClick}>
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

          <OPBadgeRelativeBox>
            {rewards && rewards?.amount > 0 ? <OPBadge /> : undefined}
          </OPBadgeRelativeBox>
        </Box>
      </Link>
      <QuestCardBottomBox>
        <QuestCardTitleBox>
          <SoraTypography fontSize="20px" lineHeight="20px" fontWeight={600}>
            {title && title.length > 22 ? `${title.slice(0, 21)}...` : title}
          </SoraTypography>
        </QuestCardTitleBox>
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
                <XPDisplayBox active={active} bgcolor={'#ff0420'}>
                  <SoraTypography
                    fontSize="14px"
                    fontWeight={700}
                    lineHeight="18px"
                    color={'#ffffff'}
                  >
                    {`${Number(apy).toFixed(1)}%`}
                  </SoraTypography>
                  <XPIconBox marginLeft="4px">
                    <APYIcon size={20} />
                  </XPIconBox>
                </XPDisplayBox>
              )}
              {variableWeeklyAPY && (
                <XPDisplayBox active={active} bgcolor={'#ff0420'}>
                  <SoraTypography
                    fontSize="14px"
                    fontWeight={700}
                    lineHeight="18px"
                    color={'#ffffff'}
                  >
                    {rewardRange ? rewardRange : `VAR.%`}
                  </SoraTypography>
                  <XPIconBox marginLeft="4px">
                    <APYIcon size={20} />
                  </XPIconBox>
                </XPDisplayBox>
              )}
              <XPDisplayBox
                active={active}
                bgcolor={!completed ? '#31007A' : '#42B852'}
              >
                <SoraTypography
                  fontSize="14px"
                  fontWeight={700}
                  lineHeight="18px"
                  color={'#ffffff'}
                >
                  {`${points}`}
                </SoraTypography>
                <XPIconBox marginLeft="4px">
                  {!completed ? (
                    <SuperfestXPIcon size={16} />
                  ) : (
                    <CheckCircleIcon sx={{ width: '16px', color: '#ffffff' }} />
                  )}
                </XPIconBox>
              </XPDisplayBox>
            </FlexCenterRowBox>
          ) : undefined}
        </FlexSpaceBetweenBox>
        <QuestCardInfoBox points={points}>
          {active && slug ? (
            <Button
              disabled={false}
              variant="secondary"
              size="medium"
              styles={{
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent',
                border: '2px dotted',
                padding: '16px',
                '&:hover': {
                  color: '#FFFFFF',
                  backgroundColor: '#ff0420',
                },
              }}
              onClick={() => router.push(slug)}
            >
              <SoraTypography
                fontSize="16px"
                lineHeight="18px"
                fontWeight={600}
              >
                {String(t('questCard.join')).toUpperCase()}
              </SoraTypography>
            </Button>
          ) : null}
        </QuestCardInfoBox>
      </QuestCardBottomBox>
    </QuestCardMainBox>
  );
};

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { ButtonSecondary } from '../../Button';
import { SuperfestXPIcon } from '../../illustrations/XPIcon';
import { FlexSpaceBetweenBox } from '../QuestPage.style';
import type { Chain } from '../QuestPage/Banner/Banner';
import { FlexCenterRowBox } from '../QuestsMissionPage.style';
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
  activeCampaign?: 'superfest';
  path: string;
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
  points,
  activeCampaign,
  path,
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
}: QuestCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { apy } = useMissionsMaxAPY(claimingIds);

  return (
    <QuestCardMainBox>
      <Link href={`${path}${slug}`}>
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
      <QuestCardBottomBox>
        <QuestCardTitleBox>
          <Typography
            variant="bodyMedium"
            fontSize="20px"
            lineHeight="20px"
            fontWeight={600}
          >
            {title && title.length > 22 ? `${title.slice(0, 21)}...` : title}
          </Typography>
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
                <XPDisplayBox
                  active={active}
                  bgcolor={theme.palette.primary.main}
                >
                  <Typography
                    variant="bodySmallStrong"
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
                    variant="bodySmallStrong"
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
                  variant="bodySmallStrong"
                  fontSize="14px"
                  fontWeight={700}
                  lineHeight="18px"
                  color={'#ffffff'}
                >
                  {`${points}`}
                </Typography>
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
            <ButtonSecondary
              disabled={false}
              size="medium"
              onClick={() => router.push(slug)}
            >
              <Typography
                variant="bodyMedium"
                fontSize="16px"
                lineHeight="18px"
                fontWeight={600}
              >
                {String(t('questCard.join')).toUpperCase()}
              </Typography>
            </ButtonSecondary>
          ) : null}
        </QuestCardInfoBox>
      </QuestCardBottomBox>
    </QuestCardMainBox>
  );
};

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '../../Button';
import { XPIcon } from '../../illustrations/XPIcon';
import Link from 'next/link';
import {
  OPBadgeRelativeBox,
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
  XPDisplayBox,
  XPIconBox,
} from './QuestCard.style';
import { Box, Typography, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import {
  PROFILE_CAMPAIGN_DARK_COLOR,
  PROFILE_CAMPAIGN_FLASHY_APY_COLOR,
  PROFILE_CAMPAIGN_LIGHT_COLOR,
} from 'src/const/partnerRewardsTheme';
import { FlexCenterRowBox, FlexSpaceBetweenBox } from '../ProfilePage.style';

interface Chain {
  logo: string;
  name: string;
}

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
}

export const QuestCard = ({
  active,
  title,
  image,
  points,
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
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { apy, isLoading, isSuccess } = useMissionsMaxAPY(claimingIds);

  return (
    <QuestCardMainBox>
      <Link
        href={link || `/quests/${slug}`}
        style={{ textDecoration: 'inherit' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '65%' }}>
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
        <QuestCardBottomBox>
          <QuestCardTitleBox>
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
                    {`${points}`}
                  </Typography>
                  <XPIconBox marginLeft="4px">
                    {!completed ? (
                      <XPIcon size={16} />
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

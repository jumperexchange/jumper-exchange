import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '../../Button';
import { SuperfestXPIcon, XPIcon } from '../../illustrations/XPIcon';
import {
  CompletedBox,
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
  QuestDatesBox,
  QuestPlatformMainBox,
  XPDisplayBox,
} from './QuestCard.style';
import { CenteredBox } from '../Superfest.style';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';

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
}

function getStringDateFormatted(startDate: string, endDate: string): string {
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  const startMonth = sDate.toLocaleString('default', { month: 'short' });
  const endMonth = eDate.toLocaleString('default', { month: 'short' });
  return `${startMonth} ${sDate.getDate()} - ${startMonth === endMonth ? '' : endMonth} ${eDate.getDate()}`;
}

export const QuestCard = ({
  active,
  title,
  image,
  points,
  link,
  startDate,
  endDate,
  platformName,
  platformImage,
}: QuestCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <QuestCardMainBox>
      {image && (
        <Image
          src={image}
          alt="Quest Card Image"
          width={256}
          height={256}
          style={{
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        />
      )}
      <QuestCardBottomBox>
        <QuestCardTitleBox>
          <ProfilePageTypography fontSize="18px" lineHeight="24px">
            {title}
          </ProfilePageTypography>
        </QuestCardTitleBox>
        <QuestCardInfoBox points={points}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignContent: 'center',
              }}
            >
              <Image
                src="https://strapi.li.finance/uploads/base_314252c925.png"
                alt="base"
                width="32"
                height="32"
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Typography style={{ marginLeft: '8px' }}>BASE</Typography>
              </Box>
            </Box>
            <XPDisplayBox active={active}>
              <ProfilePageTypography
                fontSize="14px"
                lineHeight="18px"
                sx={{
                  color: '#4285eb',
                }}
              >
                {`+${15}`}
              </ProfilePageTypography>
              <CenteredBox sx={{ marginLeft: '4px' }}>
                <SuperfestXPIcon size={16} />
              </CenteredBox>
            </XPDisplayBox>
          </Box>
          {active && link ? (
            <Button
              variant="secondary"
              size="medium"
              styles={{
                alignItems: 'center',
                width: '100%',
                backgroundColor: '#fbb934',
                padding: '16px',
              }}
            >
              <ProfilePageTypography
                fontSize="16px"
                lineHeight="18px"
                fontWeight={600}
              >
                {String(t('questCard.join')).toUpperCase()}
              </ProfilePageTypography>
            </Button>
          ) : null}
        </QuestCardInfoBox>
      </QuestCardBottomBox>
    </QuestCardMainBox>
  );
};

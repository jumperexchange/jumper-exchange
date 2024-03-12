import { Box, alpha, useTheme } from '@mui/material';
import { Button } from '../Button';
import DoneIcon from '@mui/icons-material/Done';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import {
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
} from './QuestCard.style';
import { ProfilePageTypography } from './ProfilePage.style';
import { XPBox } from './xpBox';
import { useTranslation } from 'react-i18next';

interface QuestCardProps {
  active?: boolean;
  title?: string;
  image?: string;
  points?: number;
  link?: string;
  startDate?: string | null;
  endDate?: string | null;
  platformName?: string;
  platformImage?: string;
}

function getDateFormat(startDate: string, endDate: string): string {
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
      <img
        src={image}
        width={'240px'}
        height={'240px'}
        style={{
          borderRadius: '24px',
          marginTop: 16,
        }}
      />
      <QuestCardBottomBox>
        {active ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '4px',
                }}
              >
                <img
                  src={platformImage}
                  width={'24px'}
                  height={'24px'}
                  style={{
                    borderRadius: '100%',
                  }}
                />
              </Box>
              <ProfilePageTypography fontSize={'12px'} lineHeight={'16px'}>
                {platformName}
              </ProfilePageTypography>
            </Box>
            {startDate && endDate ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor:
                    theme.palette.mode === 'light'
                      ? alpha(theme.palette.black.main, 0.04)
                      : theme.palette.alphaLight300.main,
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  borderRadius: '128px',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <DateRangeRoundedIcon sx={{ height: '16px' }} />
                </Box>
                <ProfilePageTypography fontSize={'12px'} lineHeight={'16px'}>
                  {getDateFormat(startDate, endDate)}
                </ProfilePageTypography>
              </Box>
            ) : null}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
              backgroundColor: '#d6ffe7',
              borderRadius: '128px',
              padding: '4px',
              width: '50%',
            }}
          >
            <DoneIcon sx={{ height: '16px', color: '#00B849' }} />
            <ProfilePageTypography
              fontSize={'12px'}
              lineHeight={'16px'}
              style={{ color: '#00B849' }}
            >
              {t('questCard.completed')}
            </ProfilePageTypography>
          </Box>
        )}
        <QuestCardTitleBox>
          <ProfilePageTypography fontSize={'20px'} lineHeight={'20px'}>
            {title}
          </ProfilePageTypography>
        </QuestCardTitleBox>
        <QuestCardInfoBox>
          <Box
            sx={{
              display: 'flex',
              width: active ? '50%' : '100%',
              height: '40px',
              alignItems: 'center',
              borderRadius: '128px',
              borderStyle: 'solid',
              padding: '6px',
              borderWidth: '1px',
              borderColor: '#e7d6ff',
              justifyContent: 'center',
              marginRight: active ? '8px' : undefined,
            }}
          >
            <ProfilePageTypography
              fontSize={'14px'}
              lineHeight={'18px'}
              sx={{
                color: theme.palette.mode === 'light' ? '#31007A' : '#BEA0EB',
              }}
            >
              +{points}
            </ProfilePageTypography>
            <Box
              sx={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}
            >
              <XPBox size={24} />
            </Box>
          </Box>
          {active && link ? (
            <a
              href={link}
              target="_blank"
              style={{ textDecoration: 'none', width: '50%' }}
            >
              <Button
                variant="secondary"
                size="medium"
                styles={{ alignItems: 'center', width: '100%' }}
              >
                <ProfilePageTypography
                  fontSize={'16px'}
                  lineHeight={'18px'}
                  fontWeight={600}
                  sx={{
                    padding: '8px',
                  }}
                >
                  {t('questCard.join')}
                </ProfilePageTypography>
              </Button>
            </a>
          ) : null}
        </QuestCardInfoBox>
      </QuestCardBottomBox>
    </QuestCardMainBox>
  );
};

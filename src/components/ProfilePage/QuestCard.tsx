import {
  Box,
  Container,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useUserTracking } from 'src/hooks';
import { Button } from '../Button';
import DoneIcon from '@mui/icons-material/Done';
import {
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
} from './QuestCard.style';
import { ProfilePageTypography } from './ProfilePage.style';
import { XPBox } from './xpBox';

interface QuestCardProps {
  active?: boolean;
  title?: string;
  image?: string;
  points?: number;
  link?: string;
}

export const QuestCard = ({
  active,
  title,
  image,
  points,
  link,
}: QuestCardProps) => {
  const theme = useTheme();
  const { trackPageload, trackEvent } = useUserTracking();

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
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <Box>Platform</Box>
            <Box>Date</Box>
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
              Completed
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
                color: theme.palette.mode === 'light' ? '#31007A' : '#de85ff',
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
                    color: '#31007A',
                    padding: '8px',
                  }}
                >
                  Join
                </ProfilePageTypography>
              </Button>
            </a>
          ) : null}
        </QuestCardInfoBox>
      </QuestCardBottomBox>
    </QuestCardMainBox>
  );
};

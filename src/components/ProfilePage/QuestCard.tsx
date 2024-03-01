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
import { CarouselNavigationButton } from './CarouselContainer.style';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  QuestCardBottomBox,
  QuestCardInfoBox,
  QuestCardMainBox,
  QuestCardTitleBox,
} from './QuestCard.style';
import { ProfilePageTypography } from './ProfilePage.style';

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
        <QuestCardTitleBox>
          <ProfilePageTypography fontSize={'20px'} lineHeight={'20px'}>
            {title}
          </ProfilePageTypography>
        </QuestCardTitleBox>
        <QuestCardInfoBox>
          <ProfilePageTypography
            fontSize={'32px'}
            lineHeight={'40px'}
            sx={{
              color: theme.palette.mode === 'light' ? '#31007A' : '#de85ff',
            }}
          >
            +{points}
          </ProfilePageTypography>
          {active && link ? (
            <a href={link} target="_blank" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" styles={{ alignItems: 'center' }}>
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
                <ArrowForwardIcon sx={{ width: '22px', height: '22px' }} />
              </Button>
            </a>
          ) : null}
        </QuestCardInfoBox>
      </QuestCardBottomBox>
    </QuestCardMainBox>
  );
};

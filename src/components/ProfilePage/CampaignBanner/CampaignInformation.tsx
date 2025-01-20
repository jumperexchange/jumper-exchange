import { BannerButton, Button } from 'src/components/Button';
import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  CampaignInfoVerticalBox,
  CampaignTagBox,
} from './CampaignBanner.style';
import { getContrastAlphaColor } from 'src/utils/colors';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { JUMPER_CAMPAIGN_PATH } from 'src/const/urls';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';

export const CampaignInformation = ({
  tag,
  description,
}: {
  tag: string;
  description: string;
}) => {
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <CampaignInfoVerticalBox>
      {!isMobile && (
        <CampaignTagBox>
          <Typography
            variant="title2XSmall"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {tag}
          </Typography>
        </CampaignTagBox>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(1),
        }}
      >
        <Typography
          fontSize={isMobile ? 32 : 48}
          fontWeight={700}
          color={theme.palette.text.primary}
        >
          Explore Lisk
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={theme.palette.text.secondary}
        >
          {description}
        </Typography>
      </Box>

      <BannerButton
        onClick={() => {
          trackEvent({
            category: TrackingCategory.CampaignBanner,
            action: TrackingAction.ClickCampaignBanner,
            label: 'click-campaign-banner',
            data: {
              [TrackingEventParameter.ActiveCampaignBanner]: 'lisk',
            },
          });
          router.push(`${JUMPER_CAMPAIGN_PATH}/lisk`);
        }}
        fullWidth={true}
      >
        <Typography fontSize={16} fontWeight={700}>
          Explore
        </Typography>
        <ArrowForwardIcon />
      </BannerButton>
    </CampaignInfoVerticalBox>
  );
};

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Theme } from '@mui/material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { JUMPER_CAMPAIGN_PATH } from 'src/const/urls';
import { useUserTracking } from 'src/hooks/userTracking';
import {
  BannerButton,
  CampaignInfoVerticalBox,
  CampaignTagBox,
  SubtitleTypography,
  TextDescriptionBox,
  TitleTypography,
} from './CampaignBanner.style';

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
      <TextDescriptionBox>
        <TitleTypography>Explore Lisk</TitleTypography>
        <SubtitleTypography>{description}</SubtitleTypography>
      </TextDescriptionBox>

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

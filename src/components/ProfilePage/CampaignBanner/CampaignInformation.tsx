import { useTranslation } from 'react-i18next';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import { Button } from 'src/components/Button';
import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  CampaignBox,
  CampaignInfoVerticalBox,
  CampaignTagBox,
} from './CampaignBanner.style';
import Image from 'next/image';
import { getContrastAlphaColor } from 'src/utils/colors';
import { openInNewTab } from 'src/utils/openInNewTab';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { JUMPER_CAMPAIGN_PATH } from 'src/const/urls';

export const CampaignInformation = ({
  tag,
  description,
}: {
  tag: string;
  description: string;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { quests, isLoading: isQuestsLoading, url } = useOngoingQuests();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <CampaignInfoVerticalBox>
      {!isMobile && (
        <CampaignTagBox>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
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
          Discover Lisk
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={theme.palette.text.secondary}
        >
          {description}
        </Typography>
      </Box>

      <Button
        variant="secondary"
        onClick={() => {
          //   trackEvent({
          //     category: TrackingCategory.Pageload,
          //     action: TrackingAction.PageLoad,
          //     label: 'error-discord-jumper',
          //     data: {
          //       [TrackingEventParameter.PageloadSource]:
          //         TrackingCategory.ErrorPage,
          //       [TrackingEventParameter.PageloadDestination]:
          //         'discord-jumper',
          //       [TrackingEventParameter.PageloadURL]: DISCORD_URL,
          //       [TrackingEventParameter.PageloadExternal]: true,
          //     },
          //   });
          //   openInNewTab(DISCORD_URL);
          router.push(`${JUMPER_CAMPAIGN_PATH}/lisk`);
        }}
        styles={{
          marginTop: isMobile ? '16px' : undefined,
          gap: '8px',
          borderRadius: '24px',
          '> button:hover': {
            backgroundColor: getContrastAlphaColor(theme, '4%'),
          },
          '> button:hover svg': {
            fill:
              theme.palette.mode === 'light'
                ? theme.palette.grey[700]
                : theme.palette.grey[300],
          },
        }}
        fullWidth={true}
      >
        <Typography fontSize={16} fontWeight={700}>
          Explore
        </Typography>
        <ArrowForwardIcon />
      </Button>
    </CampaignInfoVerticalBox>
  );
};

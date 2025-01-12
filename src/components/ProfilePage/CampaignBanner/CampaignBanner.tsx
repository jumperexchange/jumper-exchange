import { useTranslation } from 'react-i18next';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import { Button } from 'src/components/Button';
import { Box, Typography, useTheme } from '@mui/material';
import { CampaignBox } from './CampaignBanner.style';
import Image from 'next/image';
import { getContrastAlphaColor } from 'src/utils/colors';
import { openInNewTab } from 'src/utils/openInNewTab';
import { JUMPER_CAMPAIGN_PATH } from 'src/const/urls';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const CampaignBanner = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { quests, isLoading: isQuestsLoading, url } = useOngoingQuests();

  return (
    <CampaignBox>
      <Box sx={{ borderRadius: '16px' }}>
        <Image
          src={`https://strapi.jumper.exchange/uploads/external_435d8820af.png`}
          alt={'top banner'}
          width={640}
          height={320}
          style={{ objectFit: 'contain', borderRadius: '16px' }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Box
            sx={{
              backgroundColor: theme.palette.grey[300],
              display: 'flex',

              padding: '4px 8px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: theme.spacing(24),
              width: '33%',
            }}
          >
            <Typography fontSize={14} fontWeight={700}>
              Campaign
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1),
          }}
        >
          <Typography
            fontSize={48}
            fontWeight={700}
            color={theme.palette.text.primary}
          >
            Aerodrome
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={500}
            color={theme.palette.text.secondary}
          >
            {`Earn rewards by exploring a next-generation AMM designed to serve as
            Base’s central liquidity hub. Aerodrome combines a powerful
            liquidity incentive engine, vote-lock governance model, and friendly
            user experience.`}
          </Typography>
        </Box>
        <Box>
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
        </Box>
      </Box>
    </CampaignBox>
  );
};

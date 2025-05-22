import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Theme } from '@mui/material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  CampaignInfoBox,
  CampaignInfoContent,
  CampaignInfoCtaButton,
  CampaignInfoTagBox,
} from './CampaignBanner.style';

export const CampaignInformation = ({
  tag,
  title,
  slug,
  description,
  cta,
}: {
  tag?: string;
  title: string;
  slug: string;
  description: string;
  cta?: string;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <CampaignInfoBox>
      {!isMobile && tag && (
        <CampaignInfoTagBox>
          <Typography variant="title2XSmall">{tag}</Typography>
        </CampaignInfoTagBox>
      )}
      <CampaignInfoContent>
        <Typography
          variant="bodyXLargeStrong"
          sx={(theme) => ({
            typography: {
              xs: theme.typography.bodyXLargeStrong,
              md: theme.typography.titleLarge,
            },
          })}
        >
          {title}
        </Typography>
        <Typography
          variant="bodyMedium"
          sx={(theme) => ({
            color: (theme.vars || theme).palette.text.secondary,
          })}
        >
          {description}
        </Typography>
      </CampaignInfoContent>

      <CampaignInfoCtaButton fullWidth={true}>
        <Typography variant="bodyMediumStrong">{cta || 'Explore'}</Typography>
        <ArrowForwardIcon />
      </CampaignInfoCtaButton>
    </CampaignInfoBox>
  );
};

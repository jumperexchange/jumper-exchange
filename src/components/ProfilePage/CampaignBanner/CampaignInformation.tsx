import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Theme } from '@mui/material';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  BannerButton,
  CampaignInfoVerticalBox,
  CampaignTagBox,
  TextDescriptionBox,
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
    <CampaignInfoVerticalBox>
      {!isMobile && tag && (
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
            color: theme.palette.text.secondary,
          })}
        >
          {description}
        </Typography>
      </TextDescriptionBox>

      <BannerButton fullWidth={true}>
        <Typography variant="bodyMediumStrong">{cta || 'Explore'}</Typography>
        <ArrowForwardIcon />
      </BannerButton>
    </CampaignInfoVerticalBox>
  );
};

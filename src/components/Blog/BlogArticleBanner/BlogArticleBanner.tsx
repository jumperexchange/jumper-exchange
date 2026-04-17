'use client';
import { NewsletterSubscribeForm } from '@/app/ui/newsletter/NewsletterSubscribeForm';
import { SectionCardContainer } from '@/components/Cards/SectionCard/SectionCard.style';
import { JumperIcon } from '@/components/illustrations';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Trans } from 'react-i18next';

export const BlogArticleBanner = () => {
  return (
    <SectionCardContainer
      as={Container}
      sx={(theme) => ({
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(3),
        },
        [theme.breakpoints.up('md')]: {
          padding: theme.spacing(4),
        },
        [theme.breakpoints.up('lg')]: {
          padding: theme.spacing(6),
        },
      })}
    >
      <Stack
        sx={{
          gap: 3,
        }}
      >
        <Stack
          sx={{
            gap: 1,
          }}
        >
          <Stack
            sx={{
              gap: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="titleLarge">
              <Trans i18nKey={'blog.banner.title'} />
            </Typography>
            <LogoWrapper>
              <JumperIcon />
            </LogoWrapper>
          </Stack>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey={'blog.banner.description'} />
          </Typography>
        </Stack>
        <Box sx={{ maxWidth: '40%' }}></Box>
        <Stack
          sx={{
            gap: 1.5,
            width: '100%',
            alignSelf: 'stretch',
            '& > form': { maxWidth: '100%' },
            '& > .MuiTypography-root': { maxWidth: '100%' },
          }}
        >
          <NewsletterSubscribeForm />
        </Stack>
      </Stack>
    </SectionCardContainer>
  );
};

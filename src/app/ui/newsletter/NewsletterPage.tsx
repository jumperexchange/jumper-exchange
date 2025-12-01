'use client';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { NewsletterPageContainer } from './NewsletterPage.style';

const heroImages = [
  {
    src: '/newsletter-hero-mobile.png',
    maxWidth: 344,
    display: { xs: 'flex', sm: 'none' },
  },
  {
    src: '/newsletter-hero-desktop.png',
    maxWidth: 600,
    display: { xs: 'none', sm: 'flex' },
  },
] as const;

export const NewsletterPage = () => {
  return (
    <NewsletterPageContainer>
      {heroImages.map(({ src, maxWidth, display }) => (
        <Box key={src} sx={{ display }}>
          <Image
            src={src}
            alt="Newsletter hero image"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
              maxWidth,
              margin: '0 auto',
            }}
          />
        </Box>
      ))}
    </NewsletterPageContainer>
  );
};

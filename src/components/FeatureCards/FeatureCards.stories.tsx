'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import config from '@/config/env-config';
import { STRAPI_FEATURE_CARDS } from '@/const/strapiContentKeys';
import { useStrapi } from '@/hooks/useStrapi';
import { useAdCooldownStore } from '@/stores/adCooldown/AdCooldownStore';
import type { StrapiFeatureCardData } from '@/types/strapi';
import { FeatureCard } from './FeatureCard';

const AllCardsPreview = () => {
  useEffect(() => {
    // Bypass the production cooldown gate and ensure the store reports hydrated
    // so every FeatureCard will paint — without touching production code.
    useAdCooldownStore.setState({ adSession: {}, _hasHydrated: true });
  }, []);

  const { data: cards, isLoading } = useStrapi<StrapiFeatureCardData>({
    contentType: STRAPI_FEATURE_CARDS,
    queryKey: ['feature-cards', 'storybook'],
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="bodyMedium">Loading cards…</Typography>
      </Box>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="bodyMedium">
          No feature cards found in Strapi.
        </Typography>
      </Box>
    );
  }

  const strapiBase = config.NEXT_PUBLIC_STRAPI_URL;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(384px, 1fr))',
        gap: 3,
        padding: 3,
        justifyItems: 'center',
      }}
    >
      {cards.map((cardData, index) => {
        const adminUrl = `${strapiBase}/admin/content-manager/collection-types/api::feature-card.feature-card/${cardData.documentId}`;
        const label = cardData.uid || cardData.Title;

        return (
          <Box key={`feature-card-${cardData.id ?? index}`} sx={{ width: 384 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 1,
                mb: 0.5,
                px: 0.5,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="bodySmallStrong"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  variant="bodyXSmall"
                  sx={{ color: 'text.secondary' }}
                >
                  {cardData.documentId}
                </Typography>
              </Box>
              <Link
                href={adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                variant="bodyXSmall"
                sx={{ flexShrink: 0 }}
              >
                View in Strapi ↗
              </Link>
            </Box>
            <FeatureCard data={cardData} />
          </Box>
        );
      })}
    </Box>
  );
};

const meta: Meta<typeof AllCardsPreview> = {
  title: 'Components/FeatureCards/All Cards',
  component: AllCardsPreview,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AllCardsPreview>;

export const Default: Story = {};

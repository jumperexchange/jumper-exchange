'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: 408,
        padding: 1.5,
        margin: '0 auto',
      }}
    >
      {cards.map((cardData, index) => (
        <FeatureCard
          data={cardData}
          key={`feature-card-${cardData.id ?? index}`}
        />
      ))}
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

'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import sortBy from 'lodash/sortBy';
import { useEffect, useMemo } from 'react';
import config from '@/config/env-config';
import { STRAPI_FEATURE_CARDS } from '@/const/strapiContentKeys';
import { useStrapi } from '@/hooks/useStrapi';
import { useAdCooldownStore } from '@/stores/adCooldown/AdCooldownStore';
import type { StrapiFeatureCardData } from '@/types/strapi';
import { FeatureCard } from './FeatureCard';

// ---------------------------------------------------------------------------
// Shared header above each card cell
// ---------------------------------------------------------------------------

interface CardHeaderProps {
  cardData: StrapiFeatureCardData;
  /** Chip shown to flag publication state within this group */
  chip: { label: string; color: 'success' | 'warning' | 'error' | 'info' };
}

const CardHeader = ({ cardData, chip }: CardHeaderProps) => {
  const strapiBase = config.NEXT_PUBLIC_STRAPI_URL;
  const adminUrl = `${strapiBase}/admin/content-manager/collection-types/api::feature-card.feature-card/${cardData.documentId}`;
  const label = cardData.uid || cardData.Title;

  return (
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
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}
        >
          <Chip
            label={chip.label}
            color={chip.color}
            size="small"
            variant="outlined"
          />
          <Typography
            variant="bodySmallStrong"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Typography>
        </Box>
        <Typography variant="bodyXSmall" sx={{ color: 'text.secondary' }}>
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
  );
};

// ---------------------------------------------------------------------------
// Card grid
// ---------------------------------------------------------------------------

interface CardGridProps {
  cards: StrapiFeatureCardData[];
  /** documentIds present in the *other* group — used to cross-reference */
  otherIds: Set<string>;
  group: 'draft' | 'published';
}

const CardGrid = ({ cards, otherIds, group }: CardGridProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(384px, 1fr))',
      gap: 3,
      justifyItems: 'center',
    }}
  >
    {cards.map((cardData, index) => {
      const isInOtherGroup = otherIds.has(cardData.documentId);

      const chip: CardHeaderProps['chip'] =
        group === 'draft'
          ? isInOtherGroup
            ? { label: 'LIVE', color: 'success' }
            : { label: 'DRAFT ONLY', color: 'warning' }
          : isInOtherGroup
            ? { label: 'PUBLISHED', color: 'success' }
            : { label: 'PUBLISHED', color: 'success' };

      return (
        <Box key={`${group}-${cardData.id ?? index}`} sx={{ width: 384 }}>
          <CardHeader cardData={cardData} chip={chip} />
          <FeatureCard data={cardData} />
        </Box>
      );
    })}
  </Box>
);

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

const SectionHeading = ({ title, count }: { title: string; count: number }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="headerMedium">
      {title}{' '}
      <Typography component="span" variant="bodyMedium" color="text.secondary">
        ({count})
      </Typography>
    </Typography>
  </Box>
);

// ---------------------------------------------------------------------------
// Main story component
// ---------------------------------------------------------------------------

const AllCardsPreview = () => {
  useEffect(() => {
    // Bypass the production cooldown gate so every FeatureCard will paint.
    useAdCooldownStore.setState({ adSession: {}, _hasHydrated: true });
  }, []);

  const { data: draftCards, isLoading: draftLoading } =
    useStrapi<StrapiFeatureCardData>({
      contentType: STRAPI_FEATURE_CARDS,
      status: 'draft',
      queryKey: ['feature-cards', 'storybook', 'draft'],
    });

  const { data: publishedCards, isLoading: publishedLoading } =
    useStrapi<StrapiFeatureCardData>({
      contentType: STRAPI_FEATURE_CARDS,
      status: 'published',
      queryKey: ['feature-cards', 'storybook', 'published'],
    });

  const draftIds = useMemo(
    () => new Set((draftCards ?? []).map((c) => c.documentId)),
    [draftCards],
  );

  const publishedIds = useMemo(
    () => new Set((publishedCards ?? []).map((c) => c.documentId)),
    [publishedCards],
  );

  const sortedDraftCards = useMemo(
    () =>
      sortBy(draftCards ?? [], [
        (c) => (publishedIds.has(c.documentId) ? 0 : 1),
        (c) => (c.uid || c.Title).toLowerCase(),
      ]),
    [draftCards, publishedIds],
  );

  const sortedPublishedCards = useMemo(
    () =>
      sortBy(publishedCards ?? [], [(c) => (c.uid || c.Title).toLowerCase()]),
    [publishedCards],
  );

  if (draftLoading || publishedLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="bodyMedium">Loading cards…</Typography>
      </Box>
    );
  }

  if (!draftCards?.length && !publishedCards?.length) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="bodyMedium">
          No feature cards found in Strapi.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {!!sortedPublishedCards.length && (
        <Box sx={{ mb: 5 }}>
          <SectionHeading
            title="Published"
            count={sortedPublishedCards.length}
          />
          <CardGrid
            cards={sortedPublishedCards}
            otherIds={draftIds}
            group="published"
          />
        </Box>
      )}

      {!!sortedPublishedCards.length && !!sortedDraftCards.length && (
        <Divider sx={{ mb: 5 }} />
      )}

      {!!sortedDraftCards.length && (
        <Box>
          <SectionHeading title="Draft" count={sortedDraftCards.length} />
          <CardGrid
            cards={sortedDraftCards}
            otherIds={publishedIds}
            group="draft"
          />
        </Box>
      )}
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

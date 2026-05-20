'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import sortBy from 'lodash/sortBy';
import { useEffect } from 'react';
import config from '@/config/env-config';
import { STRAPI_FEATURE_CARDS } from '@/const/strapiContentKeys';
import { useStrapi } from '@/hooks/useStrapi';
import { useAdCooldownStore } from '@/stores/adCooldown/AdCooldownStore';
import type { StrapiFeatureCardData } from '@/types/strapi';
import type { SpindlCardData } from '@/types/spindl';
import { useSpindlMatrixCards } from './FeatureCards.stories.spindl';
import { FeatureCard } from './FeatureCard';

// ---------------------------------------------------------------------------
// Strapi card header (with Strapi admin link)
// ---------------------------------------------------------------------------

interface CardHeaderProps {
  cardData: StrapiFeatureCardData;
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
// Spindl card header (no Strapi admin link, links to CTA instead)
// ---------------------------------------------------------------------------

const SpindlCardHeader = ({ card }: { card: SpindlCardData }) => (
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
        <Chip label="SPINDL" color="info" size="small" variant="outlined" />
        <Typography
          variant="bodySmallStrong"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {card.Title}
        </Typography>
      </Box>
      <Typography variant="bodyXSmall" sx={{ color: 'text.secondary' }}>
        creative: {card.spindlData.ad_creative_id} · impression:{' '}
        {card.spindlData.impression_id}
      </Typography>
    </Box>
    {card.URL && (
      <Link
        href={card.URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        variant="bodyXSmall"
        sx={{ flexShrink: 0 }}
      >
        Preview CTA ↗
      </Link>
    )}
  </Box>
);

// ---------------------------------------------------------------------------
// Strapi card grid
// ---------------------------------------------------------------------------

interface CardGridProps {
  cards: StrapiFeatureCardData[];
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
    {cards.map((cardData) => {
      const isInOtherGroup = otherIds.has(cardData.documentId);
      const chip: CardHeaderProps['chip'] =
        group === 'draft'
          ? isInOtherGroup
            ? { label: 'LIVE', color: 'success' }
            : { label: 'DRAFT ONLY', color: 'warning' }
          : { label: 'PUBLISHED', color: 'success' };

      return (
        <Box key={`${group}-${cardData.documentId}`} sx={{ width: 384 }}>
          <CardHeader cardData={cardData} chip={chip} />
          <FeatureCard data={cardData} />
        </Box>
      );
    })}
  </Box>
);

// ---------------------------------------------------------------------------
// Spindl card grid
// ---------------------------------------------------------------------------

const SpindlCardGrid = ({ cards }: { cards: SpindlCardData[] }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(384px, 1fr))',
      gap: 3,
      justifyItems: 'center',
    }}
  >
    {cards.map((card) => (
      <Box key={`spindl-${card.id}`} sx={{ width: 384 }}>
        <SpindlCardHeader card={card} />
        <FeatureCard data={card} />
      </Box>
    ))}
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

interface AllCardsPreviewProps {
  /** Injected by the withProviders decorator via context spread */
  globals?: { locale?: string };
}

const AllCardsPreview = ({ globals }: AllCardsPreviewProps) => {
  useEffect(() => {
    // Bypass the production cooldown gate so every FeatureCard will paint.
    useAdCooldownStore.setState({ adSession: {}, _hasHydrated: true });
  }, []);

  // Derive a country code from the active locale for Spindl targeting.
  // Locale format is either 'en' or 'en-US'; fallback to 'US' when no region.
  const locale = globals?.locale || 'en';
  const country = locale.includes('-')
    ? locale.split('-')[1].toUpperCase()
    : 'US';

  const { data: draftCards, isLoading: draftLoading } =
    useStrapi<StrapiFeatureCardData>({
      contentType: STRAPI_FEATURE_CARDS,
      status: 'draft',
      includePersonalized: true,
      ignoreCampaignDates: true,
      queryKey: ['feature-cards', 'storybook', 'draft'],
    });

  const { data: publishedCards, isLoading: publishedLoading } =
    useStrapi<StrapiFeatureCardData>({
      contentType: STRAPI_FEATURE_CARDS,
      status: 'published',
      includePersonalized: true,
      ignoreCampaignDates: true,
      queryKey: ['feature-cards', 'storybook', 'published'],
    });

  const {
    cards: spindlCards,
    isLoading: spindlLoading,
    errorCount: spindlErrorCount,
  } = useSpindlMatrixCards(country);

  const draftIds = new Set((draftCards ?? []).map((c) => c.documentId));

  const publishedIds = new Set((publishedCards ?? []).map((c) => c.documentId));

  const sortedSpindlCards = sortBy(spindlCards, (c) => c.Title.toLowerCase());

  const sortedDraftCards = sortBy(draftCards ?? [], [
    (c) => (publishedIds.has(c.documentId) ? 0 : 1),
    (c) => (c.uid || c.Title).toLowerCase(),
  ]);

  const sortedPublishedCards = sortBy(publishedCards ?? [], [
    (c) => (c.uid || c.Title).toLowerCase(),
  ]);

  if (draftLoading || publishedLoading || spindlLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="bodyMedium">Loading cards…</Typography>
      </Box>
    );
  }

  if (!spindlCards.length && !draftCards?.length && !publishedCards?.length) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="bodyMedium">No cards found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {!!sortedSpindlCards.length && (
        <Box sx={{ mb: 5 }}>
          <SectionHeading title="Spindl" count={sortedSpindlCards.length} />
          {spindlErrorCount > 0 && (
            <Typography
              variant="bodyXSmall"
              sx={{ color: 'warning.main', mb: 2 }}
            >
              {spindlErrorCount} matrix call(s) failed — results may be
              incomplete.
            </Typography>
          )}
          <SpindlCardGrid cards={sortedSpindlCards} />
        </Box>
      )}

      {!!sortedSpindlCards.length &&
        !!(sortedPublishedCards.length || sortedDraftCards.length) && (
          <Divider sx={{ mb: 5 }} />
        )}

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
  title: 'Preview/FeatureCards',
  component: AllCardsPreview,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AllCardsPreview>;

export const Default: Story = {};

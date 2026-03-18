'use client';

import { useMemo, useEffect } from 'react';
import { useSpindlCards } from 'src/hooks/feature-cards/spindl/useSpindlCards';
import { useFeatureCards } from 'src/hooks/feature-cards/useFeatureCards';
import { useSpindlStore } from 'src/stores/spindl';
import { FeatureCard } from './FeatureCard';
import { FeatureCardsContainer } from './FeatureCards.style';
import { usePersonalizedFeatureCards } from '../../hooks/feature-cards/usePersonalizedFeatureCards';
import {
  useAdCooldownStore,
  getCooldownKey,
} from '@/stores/adCooldown/AdCooldownStore';
import { useAccount } from '@lifi/wallet-management';

export const FeatureCardsInner = () => {
  useSpindlCards();
  const spindl = useSpindlStore((state) => state.spindl);
  const featureCards = useFeatureCards();
  const personalizedFeatureCards = usePersonalizedFeatureCards();
  const { account } = useAccount();

  const walletAddress = account?.address ?? '';
  const isInCooldown = useAdCooldownStore((s) => s.isInCooldown(walletAddress));
  const setShownCards = useAdCooldownStore((s) => s.setShownCards);
  const cooldownDuration = useAdCooldownStore((s) => s.cooldownDuration);
  const _hasHydrated = useAdCooldownStore((s) => s._hasHydrated);

  const cards = useMemo(() => {
    return [
      ...(spindl ?? []),
      ...(featureCards ?? []),
      ...(personalizedFeatureCards ?? []),
    ];
  }, [spindl, featureCards, personalizedFeatureCards]);

  useEffect(() => {
    if (!_hasHydrated || !cards.length) {
      return;
    }

    const registerSession = () => {
      const adIds = cards.map((c) => (c.uid ?? c.id)?.toString() ?? '');
      setShownCards(walletAddress, adIds);
    };

    if (!isInCooldown) {
      registerSession();
      return;
    }

    const session =
      useAdCooldownStore.getState().adSession[getCooldownKey(walletAddress)];
    const remaining =
      cooldownDuration - (Date.now() - (session?.timestamp ?? 0));

    const timer = setTimeout(registerSession, remaining);
    return () => clearTimeout(timer);
  }, [
    cards,
    walletAddress,
    _hasHydrated,
    isInCooldown,
    cooldownDuration,
    setShownCards,
  ]);

  if (!cards.length) {
    return null;
  }

  return (
    <FeatureCardsContainer>
      {cards.map((cardData, index) => (
        <FeatureCard
          data={cardData}
          key={`feature-card-${cardData.id ?? index}`}
        />
      ))}
    </FeatureCardsContainer>
  );
};

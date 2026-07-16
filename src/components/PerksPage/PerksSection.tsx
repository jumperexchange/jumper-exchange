'use client';

import { parseAsStringEnum, useQueryState } from 'nuqs';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import {
  HorizontalTabs,
  type HorizontalTabItem,
} from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { sectionTabsSx } from '@/components/ProfilePage/sections/Section.style';
import { AchievementsTabPanel } from '@/components/ProfilePage/sections/YourAchievementsSection/AchievementsTabPanel';
import { PerkClaimModalProvider } from '@/components/ProfilePage/components/ClaimPerkModal/PerkClaimModalProvider';
import {
  PerkCard,
  type PerkCardStatus,
} from '@/components/composite/cards/PerkCard/PerkCard';
import { AppPaths } from '@/const/urls';
import {
  isClaimedPerk,
  useGetClaimedPerks,
} from '@/hooks/perks/useGetClaimedPerks';
import { useUnlockedPerks } from '@/hooks/perks/useUnlockedPerks';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { ProfileContext } from '@/providers/ProfileProvider';
import type { PerksDataAttributes } from '@/types/strapi';
import { PerkCardSkeleton } from '@/components/composite/cards/PerkCard/PerkCardSkeleton';
import { perksSectionCardSx } from './PerksPage.styles';

enum PerksTab {
  All = 'all',
  Unlocked = 'unlocked',
  Claimed = 'claimed',
}

interface PerksSectionProps {
  perks: PerksDataAttributes[];
}

export const PerksSection = ({ perks }: PerksSectionProps) => {
  const { t } = useTranslation();
  const { walletAddress, isLoading: isWalletLoading } =
    useContext(ProfileContext);
  // Persist the selected tab in the URL so it survives refresh and sharing.
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsStringEnum(Object.values(PerksTab)).withDefault(PerksTab.All),
  );

  const { level, isLoading: isLevelLoading } = useLoyaltyPass(walletAddress);
  const { data: claimedPerks, isLoading: isClaimedLoading } =
    useGetClaimedPerks(walletAddress);
  const { unlockedPerks } = useUnlockedPerks(perks);

  const currentLevel = Number(level ?? 0);

  const claimedIds = useMemo(
    () => new Set((claimedPerks ?? []).map((claim) => claim.perkId)),
    [claimedPerks],
  );

  const getStatus = (perk: PerksDataAttributes): PerkCardStatus => {
    if (isClaimedPerk(perk, claimedIds)) {
      return 'claimed';
    }
    return perk.UnlockLevel <= currentLevel ? 'unlocked' : 'locked';
  };

  // Keep locked perks at the end while preserving the incoming Featured/level
  // order within each group (Array.prototype.sort is stable).
  const lockedLast = (perks: PerksDataAttributes[]) =>
    [...perks].sort(
      (a, b) =>
        Number(getStatus(a) === 'locked') - Number(getStatus(b) === 'locked'),
    );

  const items: Record<PerksTab, PerksDataAttributes[]> = {
    [PerksTab.All]: lockedLast(perks),
    [PerksTab.Unlocked]: unlockedPerks,
    [PerksTab.Claimed]: perks.filter((perk) => isClaimedPerk(perk, claimedIds)),
  };

  const tabs: HorizontalTabItem[] = [
    { label: t('perks_page.tabs.all'), value: PerksTab.All },
    { label: t('perks_page.tabs.unlocked'), value: PerksTab.Unlocked },
    { label: t('perks_page.tabs.claimed'), value: PerksTab.Claimed },
  ];

  const tab = activeTab;

  // Loading state for the per-card skeletons: wait on the connected wallet and,
  // once we have an address, on the level + claimed lookups that drive badges.
  const isLoading =
    isWalletLoading ||
    (!!walletAddress && (isLevelLoading || isClaimedLoading));

  return (
    <PerkClaimModalProvider>
      <SectionCard sx={perksSectionCardSx}>
        <HorizontalTabs
          tabs={tabs}
          value={activeTab}
          onChange={(_, value) => setActiveTab(value as PerksTab)}
          size={HorizontalTabSize.MD}
          sx={sectionTabsSx}
          id="perks-tabs"
        />

        <AchievementsTabPanel
          items={items[tab]}
          isLoading={isLoading}
          skeleton={<PerkCardSkeleton />}
          emptyState={{
            heroImage: '/perks-empty-hero.png',
            description: t(`perks_page.empty.${tab}.description`),
            caption: t(`perks_page.empty.${tab}.caption`),
            ctaText: t(`perks_page.empty.${tab}.cta`),
            ctaLink: AppPaths.Missions,
          }}
          renderItem={(perk) => (
            <PerkCard key={perk.id} perk={perk} status={getStatus(perk)} />
          )}
        />
      </SectionCard>
    </PerkClaimModalProvider>
  );
};

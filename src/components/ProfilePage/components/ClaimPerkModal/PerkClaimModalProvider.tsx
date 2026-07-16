'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useGetClaimedPerks } from '@/hooks/perks/useGetClaimedPerks';
import { ProfileContext } from '@/providers/ProfileProvider';
import type { PerksDataAttributes } from '@/types/strapi';
import { ClaimPerkModal } from './ClaimPerkModal';
import type { StepProps } from './ClaimPerkModal.types';

interface PerkClaimModalContextValue {
  /** Opens the claim flow for a perk. No-op for perks that aren't unlocked. */
  openClaimModal: (perk: PerksDataAttributes) => void;
}

const PerkClaimModalContext = createContext<PerkClaimModalContextValue>({
  openClaimModal: () => {},
});

export const usePerkClaimModal = () => useContext(PerkClaimModalContext);

// Claims reference perks by their Strapi `documentId`, with a fallback to the
// numeric id for safety (mirrors PerksSection's matching).
const matchesPerk = (claimPerkId: string, perk: PerksDataAttributes) =>
  claimPerkId === perk.documentId || claimPerkId === String(perk.id);

/**
 * Owns a single ClaimPerkModal instance for a perks surface (hub grid or
 * profile carousel) and hands cards an `openClaimModal(perk)` callback via
 * context. Must be rendered inside a ProfileProvider so it can resolve the
 * connected wallet and the claimed-perks list that drive the modal state.
 */
export const PerkClaimModalProvider = ({ children }: PropsWithChildren) => {
  const { walletAddress } = useContext(ProfileContext);
  const { data: claimedPerks } = useGetClaimedPerks(walletAddress);

  const [selectedPerk, setSelectedPerk] = useState<PerksDataAttributes | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  const openClaimModal = useCallback((perk: PerksDataAttributes) => {
    setSelectedPerk(perk);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const contextValue = useMemo(() => ({ openClaimModal }), [openClaimModal]);

  // The claim record (if any) backs the "Perk claimed!" state and surfaces the
  // assigned promo code for perks that have already been claimed.
  const claim = selectedPerk
    ? (claimedPerks ?? []).find((c) => matchesPerk(c.perkId, selectedPerk))
    : undefined;

  return (
    <PerkClaimModalContext.Provider value={contextValue}>
      {children}
      {selectedPerk && (
        // `key` resets the modal's internal stepper state when switching perks.
        <ClaimPerkModal
          key={selectedPerk.documentId}
          isOpen={isOpen}
          onClose={handleClose}
          perkId={selectedPerk.documentId}
          permittedSteps={selectedPerk.ClaimableSteps?.selectedValues ?? []}
          stepProps={
            (selectedPerk.ClaimableStepProps ?? {}) as unknown as StepProps
          }
          walletAddress={walletAddress || undefined}
          nextStepsDescription={selectedPerk.NextStepsDescription}
          howToUsePerkDescription={selectedPerk.HowToUseDescription}
          hasCustomPromoCodes={!!selectedPerk.HasCustomPromoCodes}
          isClaimed={Boolean(claim)}
          perkPromoCode={claim?.promoCode}
        />
      )}
    </PerkClaimModalContext.Provider>
  );
};

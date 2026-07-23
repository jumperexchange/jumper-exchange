import { create } from 'zustand';
import type { QuoteSelection } from '@/utils/image-generation/deriveExtraOutputCard';
import type { PnlShareCardInput } from '@/utils/image-generation/pnlShareCard';

interface SocialCardStore {
  card: PnlShareCardInput | null;
  /** Most recent route selection from the widget, used to preview the card with
   * real data via the beta-only test trigger. */
  latestSelection: QuoteSelection | null;
  showCard: (card: PnlShareCardInput) => void;
  dismiss: () => void;
  setLatestSelection: (selection: QuoteSelection) => void;
}

export const useSocialCardStore = create<SocialCardStore>()((set) => ({
  card: null,
  latestSelection: null,
  showCard: (card) => set({ card }),
  dismiss: () => set({ card: null }),
  setLatestSelection: (latestSelection) => set({ latestSelection }),
}));

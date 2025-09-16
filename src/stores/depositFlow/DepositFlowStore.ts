import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { EarnOpportunity } from 'src/types/jumper-backend';

export interface EarnOpportunityExtended extends EarnOpportunity {
  minFromAmountUSD: number;
  positionUrl: string;
  address: string;
}

interface DepositFlowState {
  isModalOpen: boolean;
  selectedEarnOpportunity: EarnOpportunityExtended | null;

  openModal: (earnOpportunity: EarnOpportunityExtended) => void;
  closeModal: () => void;
}

export const useDepositFlowStore = createWithEqualityFn<DepositFlowState>(
  (set) => ({
    isModalOpen: false,
    selectedEarnOpportunity: null,

    openModal: (earnOpportunity: EarnOpportunityExtended) => {
      set({
        isModalOpen: true,
        selectedEarnOpportunity: earnOpportunity,
      });
    },

    closeModal: () => {
      set({
        isModalOpen: false,
        // selectedEarnOpportunity: null,
      });
    },
  }),
  shallow,
);

import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';

export interface EarnOpportunityExtended
  extends EarnOpportunityWithLatestAnalytics {
  minFromAmountUSD: number;
  positionUrl: string;
  address: string;
}

interface DepositFlowState {
  isModalOpen: boolean;
  selectedEarnOpportunity: EarnOpportunityExtended | null;
  refetchCallback?: () => void;

  openModal: (
    earnOpportunity: EarnOpportunityExtended,
    refetchCallback?: () => void,
  ) => void;
  closeModal: () => void;
}

export const useDepositFlowStore = createWithEqualityFn<DepositFlowState>(
  (set) => ({
    isModalOpen: false,
    selectedEarnOpportunity: null,
    refetchCallback: undefined,

    openModal: (
      earnOpportunity: EarnOpportunityExtended,
      refetchCallback?: () => void,
    ) => {
      set({
        isModalOpen: true,
        selectedEarnOpportunity: earnOpportunity,
        refetchCallback,
      });
    },

    closeModal: () => {
      set({
        isModalOpen: false,
        refetchCallback: undefined,
        // selectedEarnOpportunity: null,
      });
    },
  }),
  shallow,
);

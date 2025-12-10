import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import type { EarnOpportunityExtended as DepositOpportunityExtended } from '../depositFlow/DepositFlowStore';

export type EarnOpportunityExtended = DepositOpportunityExtended;

interface WithdrawFlowState {
  isModalOpen: boolean;
  selectedEarnOpportunity: EarnOpportunityExtended | null;
  refetchCallback?: () => void;

  openModal: (
    earnOpportunity: EarnOpportunityExtended,
    refetchCallback?: () => void,
  ) => void;
  closeModal: () => void;
}

export const useWithdrawFlowStore = createWithEqualityFn<WithdrawFlowState>(
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
      });
    },
  }),
  shallow,
);

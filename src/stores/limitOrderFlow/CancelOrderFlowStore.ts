import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import type { LimitOrder as Order } from '@/types/jumper-backend';

interface CancelOrderFlowState {
  isModalOpen: boolean;
  selectedOrder: Order | null;

  openModal: (order: Order) => void;
  closeModal: () => void;
}

export const useCancelOrderFlowStore =
  createWithEqualityFn<CancelOrderFlowState>(
    (set) => ({
      isModalOpen: false,
      selectedOrder: null,

      openModal: (order: Order) => {
        set({ isModalOpen: true, selectedOrder: order });
      },

      closeModal: () => {
        set({ isModalOpen: false });
      },
    }),
    shallow,
  );

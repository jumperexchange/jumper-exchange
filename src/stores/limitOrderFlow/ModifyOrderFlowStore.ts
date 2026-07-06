import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import type { Order } from '@/types/jumper-limit-order';

interface ModifyOrderFlowState {
  isModalOpen: boolean;
  selectedOrder: Order | null;

  openModal: (order: Order) => void;
  closeModal: () => void;
}

export const useModifyOrderFlowStore =
  createWithEqualityFn<ModifyOrderFlowState>(
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

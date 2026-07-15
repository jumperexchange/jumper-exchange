import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export interface OrderFlowState<Order> {
  isModalOpen: boolean;
  selectedOrder: Order | null;

  openModal: (order: Order) => void;
  closeModal: () => void;
}

export function createOrderFlowStore<Order>() {
  return createWithEqualityFn<OrderFlowState<Order>>(
    (set) => ({
      isModalOpen: false,
      selectedOrder: null,

      openModal: (order) => {
        set({ isModalOpen: true, selectedOrder: order });
      },

      closeModal: () => {
        set({ isModalOpen: false });
      },
    }),
    shallow,
  );
}

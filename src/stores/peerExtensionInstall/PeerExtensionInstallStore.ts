import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export type PeerExtensionModalType =
  | 'needs_install'
  | 'needs_connection'
  | 'onramp';

interface PeerExtensionInstallState {
  isModalOpen: boolean;
  type: PeerExtensionModalType | null;
  openModal: (type: PeerExtensionModalType) => void;
  closeModal: () => void;
}

export const usePeerExtensionInstallStore =
  createWithEqualityFn<PeerExtensionInstallState>(
    (set) => ({
      isModalOpen: false,
      type: null,
      openModal: (type) => set({ isModalOpen: true, type }),
      closeModal: () => set({ isModalOpen: false }),
    }),
    shallow,
  );

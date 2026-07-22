'use client';

import { createWithEqualityFn } from 'zustand/traditional';

interface WidgetSidePanelState {
  isSidePanelExpanded: boolean;
  toggleSidePanelExpanded: () => void;
}

export const useWidgetSidePanelStore =
  createWithEqualityFn<WidgetSidePanelState>(
    (set) => ({
      isSidePanelExpanded: false,
      toggleSidePanelExpanded: () =>
        set((state) => ({
          isSidePanelExpanded: !state.isSidePanelExpanded,
        })),
    }),
    Object.is,
  );

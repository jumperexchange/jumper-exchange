import type { ContractFilter } from 'src/integrations/royco/sdk/queries';
import { create } from 'zustand';

export interface SelectionMenuState {
  chainId: number;
  setChainId: (chainId: number) => void;

  activeTab: {
    id: string;
    label: string;
  };
  setActiveTab: (tab: { id: string; label: string }) => void;

  filters: ContractFilter[];
  setFilters: (filters: ContractFilter[]) => void;

  searchKey: string;
  setSearchKey: (searchKey: string) => void;

  sorting: any;
  setSorting: (sorting: any) => void;

  draggingId: string | null;
  setDraggingId: (draggingId: string | null) => void;

  placeholderContractList: Array<any>;
  setPlaceholderContractList: (placeholderContractList: Array<any>) => void;

  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;

  placeholderCounts: Array<number>;
  setPlaceholderCounts: (placeholderCounts: Array<number>) => void;
}

export const useSelectionMenu = create<SelectionMenuState>((set) => ({
  chainId: 1,
  setChainId: (chainId) => set({ chainId }),

  tabs: [
    {
      id: 'contracts',
      label: 'Contracts',
    },
    {
      id: 'function',
      label: 'Functions',
    },
  ],
  activeTab: {
    id: 'contracts',
    label: 'Contracts',
  },
  setActiveTab: (activeTab) => set({ activeTab }),

  filters: [],
  setFilters: (filters) => set({ filters }),

  searchKey: '',
  setSearchKey: (searchKey) => set({ searchKey }),

  sorting: [],
  setSorting: (sorting) => set({ sorting }),

  draggingId: null,
  setDraggingId: (draggingId) => set({ draggingId }),

  placeholderContractList: [[], []],
  setPlaceholderContractList: (placeholderContractList) =>
    set({ placeholderContractList }),

  pageIndex: 0,
  setPageIndex: (pageIndex) => set({ pageIndex }),

  placeholderCounts: [],
  setPlaceholderCounts: (placeholderCounts) => set({ placeholderCounts }),
}));

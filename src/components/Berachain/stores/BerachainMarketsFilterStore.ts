'use client';
import type { ChainId } from '@lifi/sdk';
import { createWithEqualityFn } from 'zustand/traditional';

interface BerachainMarketsFilterStoreProps {
  chainFilter: ChainId[];
  setChainFilter: (chainId: ChainId) => void;
  tokenFilter: string[];
  setTokenFilter: (token: string) => void;
  protocolFilter: string[];
  setProtocolFilter: (protocol: string) => void;
  sort: string | undefined;
  setSort: (sort: string) => void;
  search: string | undefined;
  setSearch: (search: string | undefined) => void;
}

export const useBerachainMarketsFilterStore =
  createWithEqualityFn<BerachainMarketsFilterStoreProps>(
    (set) => ({
      chainFilter: [],
      tokenFilter: [],
      protocolFilter: [],
      sort: undefined,
      search: undefined,
      setChainFilter: (chainId) => {
        set((state) => {
          const updatedChainFilter = [...state.chainFilter];
          const index = updatedChainFilter.indexOf(chainId);
          if (index === -1) {
            updatedChainFilter.push(chainId);
          } else {
            updatedChainFilter.splice(index, 1);
          }
          return { chainFilter: updatedChainFilter };
        });
      },
      setTokenFilter: (token) => {
        set((state) => {
          const updatedTokenFilter = [...state.tokenFilter];
          const index = updatedTokenFilter.indexOf(token);
          if (index === -1) {
            updatedTokenFilter.push(token);
          } else {
            updatedTokenFilter.splice(index, 1);
          }
          return { tokenFilter: updatedTokenFilter };
        });
      },
      setProtocolFilter: (protocol) => {
        set((state) => {
          const updatedProtocolFilter = [...state.protocolFilter];
          const index = updatedProtocolFilter.indexOf(protocol);
          if (index === -1) {
            updatedProtocolFilter.push(protocol);
          } else {
            updatedProtocolFilter.splice(index, 1);
          }
          return { protocolFilter: updatedProtocolFilter };
        });
      },
      setSort: (sort) => {
        set((state) => {
          let updatedSort = state.sort;
          if (updatedSort === sort) {
            updatedSort = undefined;
          } else {
            updatedSort = sort;
          }
          return { sort: updatedSort };
        });
      },
      setSearch: (text: string | undefined) => {
        set(() => {
          return { search: text };
        });
      },
    }),
    Object.is,
  );

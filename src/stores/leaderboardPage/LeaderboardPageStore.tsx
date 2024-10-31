'use client';
import { createWithEqualityFn } from 'zustand/traditional';

export const LEADERBOARD_LENGTH = 25;

interface LeaderboardPageState {
  page: number;
  setPage: (page: number) => void;
  maxPages: number;
  setMaxPages: (page: number) => void;
  setPreviousPage: () => void;
  setFirstPage: () => void;
  setNextPage: () => void;
  setLastPage: () => void;
  setUserPage: (position: number) => void;
}

export const useLeaderboardPageStore =
  createWithEqualityFn<LeaderboardPageState>(
    (set, get) => ({
      page: 1, //TabsMap.Exchange.index,
      setPage: (page) => set({ page: page }),
      maxPages: LEADERBOARD_LENGTH,
      setMaxPages: (maxPages) => set({ maxPages: maxPages }),
      setNextPage: () => {
        const state = get();
        set({ page: Math.min(state.page + 1, state.maxPages) });
      },

      setPreviousPage: () => {
        const state = get();
        set({
          page: Math.max(state.page - 1, 1),
        });
      },

      setFirstPage: () => {
        set({ page: 1 });
      },

      setLastPage: () => {
        const state = get();
        set({ page: state.maxPages });
      },

      // go to page with user's position
      setUserPage: (position) => {
        const calculatedPage = Math.ceil(position / LEADERBOARD_LENGTH);
        set({ page: calculatedPage });
      },
    }),
    Object.is,
  );

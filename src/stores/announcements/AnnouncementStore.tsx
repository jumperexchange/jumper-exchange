'use client';
import type { AnnouncementState } from '@/types/announcement';
import uniq from 'lodash/uniq';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

const defaultAnnouncements = {
  dismissedAnnouncements: [],
  lastFetchDate: null,
};

export const useAnnouncementStore = createWithEqualityFn(
  persist<AnnouncementState>(
    (set, get) => ({
      ...defaultAnnouncements,

      dismissAnnouncement: (documentId: string) => {
        set((state) => ({
          dismissedAnnouncements: uniq([
            ...state.dismissedAnnouncements,
            documentId,
          ]),
        }));
      },

      resetDismissedAnnouncements: () => {
        set({
          dismissedAnnouncements: [],
        });
      },

      setLastFetchDate: (date: number) => {
        set({
          lastFetchDate: date,
        });
      },

      isAnnouncementDismissed: (documentId: string) => {
        return get().dismissedAnnouncements.includes(documentId);
      },
    }),
    {
      name: 'jumper-announcements',
      version: 1,
    },
  ),
  shallow,
);

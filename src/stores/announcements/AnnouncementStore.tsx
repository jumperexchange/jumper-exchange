'use client';
import type { AnnouncementState } from '@/types/announcement';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

const defaultAnnouncements = {
  dismissedAnnouncements: [],
  lastFetchDate: null,
};

export const useAnnouncementStore = createWithEqualityFn<AnnouncementState>(
  persist(
    (set, get) => ({
      ...defaultAnnouncements,

      dismissAnnouncement: (documentId: string) => {
        const dismissedAnnouncements = get().dismissedAnnouncements;
        if (!dismissedAnnouncements.includes(documentId)) {
          set({
            dismissedAnnouncements: [...dismissedAnnouncements, documentId],
          });
        }
      },

      resetDismissedAnnouncements: () => {
        set({
          dismissedAnnouncements: [],
        });
      },

      // Update last fetch date
      setLastFetchDate: (date: number) => {
        set({
          lastFetchDate: date,
        });
      },

      // Check if announcement is dismissed
      isAnnouncementDismissed: (documentId: string) => {
        return get().dismissedAnnouncements.includes(documentId);
      },
    }),
    {
      name: 'jumper-announcements',
      version: 1,
    },
  ) as StateCreator<AnnouncementState, [], [], AnnouncementState>,
  shallow,
);

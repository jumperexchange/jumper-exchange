'use client';

import uniq from 'lodash/uniq';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { NotificationStoreState } from '@/types/notifications';

const defaultNotificationState = {
  readNotificationIds: [] as string[],
  deletedNotificationIds: [] as string[],
};

export const useNotificationStore = createWithEqualityFn(
  persist<NotificationStoreState>(
    (set, get) => ({
      ...defaultNotificationState,

      markAsRead: (id: string) => {
        set((state) => ({
          readNotificationIds: uniq([...state.readNotificationIds, id]),
        }));
      },

      deleteNotification: (id: string) => {
        set((state) => ({
          deletedNotificationIds: uniq([...state.deletedNotificationIds, id]),
        }));
      },

      isRead: (id: string) => get().readNotificationIds.includes(id),

      isDeleted: (id: string) => get().deletedNotificationIds.includes(id),
    }),
    {
      name: 'jumper-notifications',
      version: 1,
    },
  ),
  shallow,
);

'use client';

import uniq from 'lodash/uniq';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type {
  NotificationStoreData,
  NotificationStoreState,
} from '@/types/notifications';

const defaultNotificationState: NotificationStoreData = {
  readNotificationIdsByAccount: {},
  deletedNotificationIdsByAccount: {},
};

export const useNotificationStore = createWithEqualityFn(
  persist<NotificationStoreState, [], [], NotificationStoreData>(
    (set, get) => ({
      ...defaultNotificationState,

      markAsRead: (account: string, id: string) => {
        set((state) => {
          const prev = state.readNotificationIdsByAccount[account] ?? [];
          return {
            readNotificationIdsByAccount: {
              ...state.readNotificationIdsByAccount,
              [account]: uniq([...prev, id]),
            },
          };
        });
      },

      deleteNotification: (account: string, id: string) => {
        set((state) => {
          const prev = state.deletedNotificationIdsByAccount[account] ?? [];
          return {
            deletedNotificationIdsByAccount: {
              ...state.deletedNotificationIdsByAccount,
              [account]: uniq([...prev, id]),
            },
          };
        });
      },

      isRead: (account: string, id: string) =>
        (get().readNotificationIdsByAccount[account] ?? []).includes(id),

      isDeleted: (account: string, id: string) =>
        (get().deletedNotificationIdsByAccount[account] ?? []).includes(id),
    }),
    {
      name: 'jumper-notifications',
      version: 2,
      partialize: (state) => ({
        readNotificationIdsByAccount: state.readNotificationIdsByAccount,
        deletedNotificationIdsByAccount: state.deletedNotificationIdsByAccount,
      }),
      migrate: () => defaultNotificationState,
    },
  ),
  shallow,
);

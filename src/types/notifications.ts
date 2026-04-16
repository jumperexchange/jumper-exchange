export type NotificationCategory =
  | 'earn'
  | 'product'
  | 'campaign'
  | 'portfolio';

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  ctaLabel: string;
  ctaUrl: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  isGlobal: boolean;
  metadata: Record<string, unknown>;
  priority: number;
  sourceRuleId: string;
  status: string;
  userAddress: string;
}

export interface NotificationStoreData {
  readNotificationIdsByAccount: Record<string, string[]>;
  deletedNotificationIdsByAccount: Record<string, string[]>;
}

export interface NotificationStoreState extends NotificationStoreData {
  markAsRead: (account: string, id: string) => void;
  deleteNotification: (account: string, id: string) => void;
  isRead: (account: string, id: string) => boolean;
  isDeleted: (account: string, id: string) => boolean;
}

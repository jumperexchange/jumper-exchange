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

export interface NotificationStoreState {
  readNotificationIds: string[];
  deletedNotificationIds: string[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  isRead: (id: string) => boolean;
  isDeleted: (id: string) => boolean;
}

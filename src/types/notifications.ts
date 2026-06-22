// TODO(JUM-592): Use shared type for this payload
export enum NotificationCategory {
  Earn = 'earn',
  Product = 'product',
  Campaign = 'campaign',
  Portfolio = 'portfolio',
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
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

export interface NotificationSummary {
  /** Live (non-expired) notification count, computed server-side. */
  count: number;
  /** Expired subset of the count, exposed for future client-side use. */
  expiredCount: number;
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

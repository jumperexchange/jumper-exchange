import type { BlocksContent } from '@strapi/blocks-react-renderer';
import type { StrapiMediaData } from './strapi';

export type AnnouncementSeverityType = 'error' | 'warning' | 'info' | 'success';

export interface AnnouncementData {
  id: number;
  documentId: string;
  Content: BlocksContent;
  Severity: AnnouncementSeverityType;
  Priority: number;
  StartDate: string;
  EndDate: string | null;
  Logo?: StrapiMediaData | null;
  Dismissible: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AnnouncementDisplay {
  id: number;
  documentId: string;
  content: BlocksContent;
  severity: AnnouncementSeverityType;
  priority: number;
  startDate: string;
  endDate: string | null;
  logo?: StrapiMediaData | null;
  dismissible: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AnnouncementProps {
  dismissedAnnouncements: string[];
  lastFetchDate: number | null;
}

export interface AnnouncementState extends AnnouncementProps {
  dismissAnnouncement: (documentId: string) => void;
  resetDismissedAnnouncements: () => void;
  setLastFetchDate: (date: number) => void;
  isAnnouncementDismissed: (documentId: string) => boolean;
}

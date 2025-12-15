import type { ReactNode } from 'react';
import type { SlideProps, SxProps, Theme } from '@mui/material';
import type { TrackingAction, TrackingCategory } from '@/const/trackingKeys';

export interface WelcomeOverlayLayoutProps {
  overlayContent: ReactNode;
  children: ReactNode;
  isOverlayOpen: boolean;
  onOverlayClose: () => void;
  enabled: boolean;
  trackingConfig?: {
    category: TrackingCategory;
    action: TrackingAction;
    label: string;
    enableAddressable?: boolean;
  };
  slideDirection?: SlideProps['direction'];
  slideTimeout?: number;
  overlayClassName?: string;
  overlayZIndex?: number;
  containerSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  leftSideContent?: ReactNode;
  fullWidthGlowEffect?: boolean;
}

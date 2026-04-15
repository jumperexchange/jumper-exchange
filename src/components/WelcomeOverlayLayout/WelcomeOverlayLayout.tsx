'use client';
import { useUserTracking } from '@/hooks/userTracking';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import type { WelcomeOverlayLayoutProps } from './WelcomeOverlayLayout.types';
import { GlowContainer } from './WelcomeOverlayLayout.styles';

export const WelcomeOverlayLayout = ({
  overlayContent,
  children,
  isOverlayOpen,
  onOverlayClose,
  enabled,
  trackingConfig,
  slideDirection = 'up',
  slideTimeout = 400,
  overlayClassName,
  overlayZIndex = 999,
  containerSx,
  contentSx = {},
  leftSideContent,
  fullWidthGlowEffect = false,
}: WelcomeOverlayLayoutProps) => {
  const { trackEvent } = useUserTracking();

  const handleOverlayClick = () => {
    if (enabled && isOverlayOpen) {
      onOverlayClose();

      if (trackingConfig) {
        trackEvent(trackingConfig);
      }
    }
  };

  useEffect(() => {
    const anyWindow =
      typeof window !== 'undefined'
        ? (window as unknown as Record<string, unknown>)
        : undefined;
    const isIframeEnvironment = anyWindow && anyWindow.parent !== anyWindow;

    if (isIframeEnvironment) {
      onOverlayClose();
    }
  }, [onOverlayClose]);

  return (
    <Box onClick={handleOverlayClick} sx={containerSx}>
      <Slide
        direction={slideDirection}
        in={enabled && isOverlayOpen}
        appear={false}
        timeout={slideTimeout}
        className={overlayClassName}
        mountOnEnter
        unmountOnExit
      >
        <Box
          style={{
            zIndex: overlayZIndex,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          {overlayContent}
        </Box>
      </Slide>
      <Stack
        direction="row"
        sx={[
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
          },
          {
            height: !isOverlayOpen ? '100%' : 'auto',
            overflow: {
              xs: !isOverlayOpen ? 'scroll' : 'hidden',
              sm: !isOverlayOpen ? 'inherit' : 'hidden',
            },
            paddingTop: 3.5,
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'none',
          },
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        {leftSideContent}
        <GlowContainer
          overlayOpen={isOverlayOpen}
          fullWidthGlowEffect={fullWidthGlowEffect}
          className={
            overlayClassName ? `${overlayClassName}-content` : undefined
          }
        >
          {children}
        </GlowContainer>
      </Stack>
    </Box>
  );
};

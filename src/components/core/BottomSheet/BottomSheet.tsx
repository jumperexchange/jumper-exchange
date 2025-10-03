import Drawer from '@mui/material/Drawer';
import {
  FC,
  PropsWithChildren,
  forwardRef,
  startTransition,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  RefObject,
  useEffect,
  useLayoutEffect,
} from 'react';

export interface BottomSheetBase {
  isOpen(): void;
  open(): void;
  close(): void;
}

interface BottomSheetProps extends PropsWithChildren {
  open?: boolean;
  onClose?: () => void;
  containerId: string;
  elementRef?: RefObject<HTMLDivElement>;
}

export const BottomSheet = forwardRef<any, BottomSheetProps>(
  ({ containerId, elementRef, children, open = false, onClose }, ref) => {
    const [drawerOpen, setDrawerOpen] = useState(open);
    const openRef = useRef(open);
    const [isInert, setIsInert] = useState(!open);

    let container = document.getElementById(containerId);

    useLayoutEffect(() => {
      container = document.getElementById(containerId);
    }, [containerId]);

    useEffect(() => {
      if (container && open) {
        setIsInert(false);
        setDrawerOpen(true);
        openRef.current = true;
      } else if (!open) {
        setIsInert(true);
        setDrawerOpen(false);
        openRef.current = false;
      }
    }, [open, container]);

    const close = useCallback(() => {
      setIsInert(true);
      startTransition(() => {
        setDrawerOpen(false);
        openRef.current = false;
        onClose?.();
      });
    }, [onClose]);

    const openDrawer = useCallback(() => {
      if (container) {
        setIsInert(false);
        setDrawerOpen(true);
        openRef.current = true;
      }
    }, [container]);

    useImperativeHandle(
      ref,
      () => ({
        isOpen: () => openRef.current,
        open: openDrawer,
        close,
      }),
      [openDrawer, close],
    );

    return (
      <Drawer
        container={container}
        ref={elementRef}
        anchor="bottom"
        open={drawerOpen}
        onClose={close}
        disableAutoFocus
        inert={isInert}
        ModalProps={{
          container: container,
          style: { position: 'absolute' },
        }}
        slotProps={{
          transition: {
            direction: 'up',
            appear: true,
          },
          paper: {
            sx: (theme) => ({
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundImage: 'none',
              backgroundColor: (theme.vars || theme).palette.background.default,
              borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
              borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
            }),
          },
          backdrop: {
            sx: {
              position: 'absolute',
              backgroundColor: 'rgb(0 0 0 / 32%)',
              backdropFilter: 'blur(3px)',
            },
          },
        }}
      >
        {children}
      </Drawer>
    );
  },
);

import { styled } from '@mui/material';
import Stack from '@mui/system/Stack';
import { AnimatePresence, motion } from 'motion/react';
import type { FC, PropsWithChildren } from 'react';

const LayoutContainer = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'fitContent',
})<{ fitContent?: boolean }>(({ fitContent }) => ({
  width: fitContent ? 'auto' : '100%',
  height: '100%',
  flexShrink: fitContent ? 0 : undefined,
}));

interface EarnAnimatedLayoutContainerProps extends PropsWithChildren {
  useStackWrapper?: boolean;
  /** Size to the content instead of filling the parent's width. */
  fitContent?: boolean;
}

export const EarnAnimatedLayoutContainer: FC<
  EarnAnimatedLayoutContainerProps
> = ({ children, useStackWrapper = true, fitContent = false }) => {
  return (
    <AnimatePresence>
      <LayoutContainer
        fitContent={fitContent}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        exit={{ opacity: 0 }}
        transition={{
          type: 'tween',
          duration: 0.3,
        }}
      >
        {useStackWrapper ? (
          <Stack
            direction="row"
            sx={{
              gap: 1,
              alignItems: 'center',
              flex: 1,
              flexWrap: 'wrap',
            }}
          >
            {children}
          </Stack>
        ) : (
          children
        )}
      </LayoutContainer>
    </AnimatePresence>
  );
};

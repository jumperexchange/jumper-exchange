import { styled } from '@mui/material';
import Stack from '@mui/system/Stack';
import { AnimatePresence, motion } from 'motion/react';
import { FC, PropsWithChildren } from 'react';

const LayoutContainer = styled(motion.div)({
  width: '100%',
  height: '100%',
});

interface EarnAnimatedLayoutContainerProps extends PropsWithChildren {
  useStackWrapper?: boolean;
}

export const EarnAnimatedLayoutContainer: FC<
  EarnAnimatedLayoutContainerProps
> = ({ children, useStackWrapper = true }) => {
  return (
    <AnimatePresence>
      <LayoutContainer
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
          <Stack direction="row" gap={1} alignItems="center" flex={1}>
            {children}
          </Stack>
        ) : (
          children
        )}
      </LayoutContainer>
    </AnimatePresence>
  );
};

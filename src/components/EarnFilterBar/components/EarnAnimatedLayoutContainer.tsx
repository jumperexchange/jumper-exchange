import { styled } from '@mui/material';
import Stack from '@mui/system/Stack';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

const LayoutContainer = styled(motion.div)({
  width: '100%',
  height: '100%',
});

export const EarnAnimatedLayoutContainer: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <AnimatePresence>
      <LayoutContainer
        initial={{ opacity: 0, y: '100%' }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
        }}
      >
        <Stack direction="row" gap={1} alignItems="center" flex={1}>
          {children}
        </Stack>
      </LayoutContainer>
    </AnimatePresence>
  );
};

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
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        exit={{ opacity: 0 }}
        transition={{
          type: 'fade',
          duration: 0.3,
        }}
      >
        <Stack direction="row" gap={1} alignItems="center" flex={1}>
          {children}
        </Stack>
      </LayoutContainer>
    </AnimatePresence>
  );
};

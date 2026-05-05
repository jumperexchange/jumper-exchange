'use client';

import { styled } from '@mui/material';
import Stack from '@mui/system/Stack';
import { motion } from 'motion/react';
import type { FC, PropsWithChildren } from 'react';

const LayoutContainer = styled(motion.div)({
  width: '100%',
  height: '100%',
});

interface PortfolioAnimatedLayoutContainerProps extends PropsWithChildren {
  useStackWrapper?: boolean;
}

export const PortfolioAnimatedLayoutContainer: FC<
  PortfolioAnimatedLayoutContainerProps
> = ({ children, useStackWrapper = true }) => {
  return (
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
        <Stack
          direction="row"
          sx={{
            gap: 1,
            alignItems: 'center',
            justifyContent: 'end',
            flex: 1,
          }}
        >
          {children}
        </Stack>
      ) : (
        children
      )}
    </LayoutContainer>
  );
};

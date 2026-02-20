'use client';

import { motion } from 'motion/react';
import type { FC, PropsWithChildren } from 'react';
import { PortfolioAssetContainer } from './PortfolioPage.styles';

export const PortfolioAnimatedAssetContainer: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3 }}
    >
      <PortfolioAssetContainer>{children}</PortfolioAssetContainer>
    </motion.div>
  );
};

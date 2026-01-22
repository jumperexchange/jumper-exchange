import { AnimatePresence, motion } from 'motion/react';
import { useMemo } from 'react';

import { useEarnFiltering } from '../EarnFilteringContext';
import { EarnFilterTab } from '../types';
import { EarnEmptyListAllMarkets } from './EarnEmptyListAllMarkets';
import { EarnEmptyListForYou } from './EarnEmptyListForYou';
import { EarnEmptyListYourPositions } from './EarnEmptyListYourPositions';

export const EarnEmptyList = () => {
  const { data, isLoading, tab } = useEarnFiltering();

  const isEmptyList = useMemo(() => {
    return !isLoading && (!data || data.length === 0);
  }, [isLoading, data]);

  return (
    <AnimatePresence mode="popLayout">
      {isEmptyList && tab === EarnFilterTab.YOUR_POSITIONS && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          key="earn-empty-list-your-positions"
        >
          <EarnEmptyListYourPositions />
        </motion.div>
      )}

      {isEmptyList && tab === EarnFilterTab.ALL && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          key="earn-empty-list-all-markets"
        >
          <EarnEmptyListAllMarkets />
        </motion.div>
      )}
      {isEmptyList && tab === EarnFilterTab.FOR_YOU && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          key="earn-empty-list-for-you"
        >
          <EarnEmptyListForYou />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

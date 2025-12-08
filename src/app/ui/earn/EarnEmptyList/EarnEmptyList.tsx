import { useMemo } from 'react';
import { useEarnFiltering } from '../EarnFilteringContext';
import { EarnEmptyListYourPositions } from './EarnEmptyListYourPositions';
import { EarnEmptyListAllMarkets } from './EarnEmptyListAllMarkets';
import { AnimatePresence, motion } from 'motion/react';

export const EarnEmptyList = () => {
  const { data, isLoading, showForYou, showYourPositions } = useEarnFiltering();

  const isEmptyList = useMemo(() => {
    return !isLoading && (!data || data.length === 0);
  }, [isLoading, data]);
  return (
    <AnimatePresence mode="popLayout">
      {isEmptyList && showYourPositions && (
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

      {isEmptyList && !showYourPositions && !showForYou && (
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
    </AnimatePresence>
  );
};

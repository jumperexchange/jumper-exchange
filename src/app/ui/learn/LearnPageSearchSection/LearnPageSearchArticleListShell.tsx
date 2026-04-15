import Stack from '@mui/material/Stack';
import { motion } from 'motion/react';
import type { FC, ReactNode } from 'react';
import { Children, isValidElement } from 'react';

const listVariants = {
  animate: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.16, ease: 'easeOut' },
  },
} as const;

interface LearnPageSearchArticleListShellProps {
  children: ReactNode;
  listKey?: string;
}

export const LearnPageSearchArticleListShell: FC<
  LearnPageSearchArticleListShellProps
> = ({ children, listKey }) => (
  <Stack
    component={motion.ul}
    variants={listVariants}
    initial="initial"
    animate="animate"
    key={listKey}
    sx={{
      gap: 1,
      listStyle: 'none',
      m: 0,
      p: 0,
    }}
  >
    {Children.map(children, (child) => (
      <motion.li
        variants={itemVariants}
        key={isValidElement(child) ? child.key : undefined}
      >
        {child}
      </motion.li>
    ))}
  </Stack>
);

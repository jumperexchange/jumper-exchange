'use client';

import { useContext } from 'react';
import { JumperFlagsContext } from './JumperFlagsProvider';
import type { JumperFlagsContextValue } from './types';

export const useJumperFlags = (): JumperFlagsContextValue => {
  const context = useContext(JumperFlagsContext);

  if (context === undefined) {
    throw new Error('useJumperFlags must be used within a JumperFlagsProvider');
  }

  return context;
};

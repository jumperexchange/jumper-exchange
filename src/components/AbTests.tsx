'use client';

import { useAccount } from '@lifi/wallet-management';
import { AbTestConfig } from 'src/const/abtests';
import { useAbTestsStore } from 'src/stores/abTests';

export const AbTests = () => {
  const { account } = useAccount();
  const { activeTests } = useAbTestsStore();

  // Only run AB tests if the master flag is enabled
  if (!AbTestConfig.enabled) {
    return null;
  }

  // Example: Check if widget subvariants test is enabled
  if (activeTests.TEST_WIDGET_SUBVARIANTS) {
    // Add your AB test logic here
  }

  return null;
};

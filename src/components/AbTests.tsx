'use client';

import { AbTestConfig } from 'src/const/abtests';
import { useAbTestsStore } from 'src/stores/abTests';

export const AbTests = () => {
  // const { account } = useAccount();
  const { activeAbTests } = useAbTestsStore();

  // Only run AB tests if the master flag is enabled
  if (!AbTestConfig.enabled) {
    return null;
  }

  // Example: Check if widget subvariants test is enabled
  if (activeAbTests.TEST_WIDGET_SUBVARIANTS) {
    // Add your AB test logic here
  }

  return null;
};

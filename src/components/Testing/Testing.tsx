'use client';

import type { NavigatorUAData } from 'src/types/internal';

const Testing = () => {
  const isMobile =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'userAgentData' in navigator &&
    (navigator as Navigator & { userAgentData: NavigatorUAData }).userAgentData
      .mobile;
  const isMetamask = `${
    typeof navigator !== 'undefined' &&
    navigator?.userAgent?.includes('MetaMaskMobile')
  }`;
  const isPhantom = `${
    typeof navigator !== 'undefined' &&
    navigator?.userAgent?.includes('Phantom')
  }`;
  return (
    <>
      -
      <p>
        isMobile?
        {isMobile}
      </p>
      <p>
        IsMetamask?
        {isMetamask}
      </p>
      <p>
        IsPhantom?
        {isPhantom}
      </p>
    </>
  );
};

export default Testing;

'use client';

const Testing = () => {
  const isMobile = (window as any)?.navigator.userAgentData.mobile
    ? 'true'
    : 'false';
  const provider = (window as any)?.ethereum ? 'true' : 'false';
  const isMetamask = `${
    typeof navigator !== 'undefined' &&
    navigator?.userAgent?.includes('MetaMaskMobile')
  }`;
  const isPhantom = `${
    typeof navigator !== 'undefined' &&
    navigator?.userAgent?.includes('Phantom')
  }`;

  console.log('isMobile', isMobile);
  return (
    <>
      -
      <p>
        window.ethereum?
        {provider}
      </p>
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

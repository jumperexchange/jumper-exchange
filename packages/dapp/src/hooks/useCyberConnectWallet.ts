import { CyberApp } from '@cyberlab/cyber-app-sdk';

export const useCyberConnectWallet = () => {
  const checkCyberConnectEnvironment = async () => {
    // in Multisig env, window.parent is not equal to window
    const isIframeEnvironment = window.parent !== window;

    if (!isIframeEnvironment) {
      return false;
    }

    const sdk = new CyberApp({
      name: 'Li.Fi',
      icon: 'https://github.com/lifinance/types/blob/main/src/assets/icons/bridges/lifuel.png',
    });

    const accountInfo = await Promise.race([
      sdk.start(),
      new Promise<undefined>((resolve) => setTimeout(resolve, 200)),
    ]);

    return !!accountInfo?.address;
  };

  return {
    checkCyberConnectEnvironment,
  };
};

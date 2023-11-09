import { isCyberWallet } from '@cyberlab/cyber-app-sdk';

export const useCyberConnectWallet = () => {
  const checkCyberConnectEnvironment = () => {
    // in Multisig env, window.parent is not equal to window
    const isIframeEnvironment = window.parent !== window;

    if (!isIframeEnvironment) {
      return false;
    }
    return isCyberWallet();
  };

  return {
    checkCyberConnectEnvironment,
  };
};

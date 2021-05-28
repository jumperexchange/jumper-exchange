import { useWeb3React } from '@web3-react/core';
import React from 'react';

import { injected } from './connectors';

function ConnectButton() {
  const { activate } = useWeb3React();

  return (
    <button style={{ display: 'block' }} onClick={() => activate(injected)}>
      Connect with MetaMask
    </button>
  );
}

export default ConnectButton;

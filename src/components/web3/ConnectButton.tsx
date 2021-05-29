import { useWeb3React } from '@web3-react/core';
import { Button } from 'antd';
import React from 'react';

import { injected } from './connectors';

function ConnectButton() {
  const { activate } = useWeb3React();


  return (
    <Button style={{ display: 'block' }} onClick={() => activate(injected)}>
      Connect with MetaMask
    </Button>
  );
}

export default ConnectButton;

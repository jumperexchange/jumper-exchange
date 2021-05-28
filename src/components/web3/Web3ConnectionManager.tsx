import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';

import { useEagerConnect, useInactiveListener } from './hooks';
import { network } from './connectors';

function Web3ConnectionManager({ children }: { children: JSX.Element }) {
  const context = useWeb3React<Web3Provider>();
  const { connector, activate, active } = context;

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  useEffect(() => {
    if (triedEager && !active) {
      activate(network);
    }
  }, [triedEager, active, connector, activate]);

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager);

  return children;
}

export default Web3ConnectionManager;

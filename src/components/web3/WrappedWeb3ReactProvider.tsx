import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function WrappedWeb3ReactProvider({ children }: { children: JSX.Element }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  );
}

export default WrappedWeb3ReactProvider;

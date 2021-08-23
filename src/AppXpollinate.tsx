import { Layout } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';
import SwapXpollinate from './components/xpollinate/SwapXpollinate';

function usePageViews() {
  let location = (window as any).location
  useEffect(() => {
    analytics.sendPageView(location.pathname)
  }, [location])
}

function AppXpollinate() {
  usePageViews()

  return (
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        <Layout>
          <SwapXpollinate />
        </Layout>
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  );
}

export { AppXpollinate };

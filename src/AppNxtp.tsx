import { Layout } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';
import SwapNxtp from './components/SwapNxtp';

function usePageViews() {
  let location = (window as any).location
  useEffect(() => {
    analytics.sendPageView(location.pathname)
  }, [location])
}

function AppNxtp() {
  usePageViews()

  return (
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        <Layout>
          <SwapNxtp />
        </Layout>
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  );
}

export { AppNxtp };

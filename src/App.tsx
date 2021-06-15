import { Layout, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React, { useEffect } from 'react';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import logo from './assets/icon192.png';
import AboutPage from './components/AboutPage';
import Dashboard from './components/Dashboard';
import NotFoundPage from './components/NotFoundPage';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';

function usePageViews() {
  let location = useLocation()
  useEffect(() => {
    analytics.sendPageView(location.pathname)
  }, [location])
}

function App() {
  usePageViews()

  return (
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        <Layout>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}>
            <Link to="/" className="wordmark">
              <img src={logo} className="logo" alt={process.env.REACT_APP_PROJECT_NAME} />
              Li.Finance
            </Link>
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to="/">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/about">About</Link>
              </Menu.Item>
            </Menu>
          </Header>

          <Switch>
            <Route exact path="/">
              <Dashboard/>
            </Route>
            <Route path="/about">
              <AboutPage/>
            </Route>
            <Route path="*">
              <NotFoundPage/>
            </Route>
          </Switch>
        </Layout>
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  );
}

export default App;

import React from 'react';
import logo from './assets/logo.svg';
import { Layout, Menu } from 'antd';
import { Header, Footer } from 'antd/lib/layout/layout';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div >
          <img src={logo} className="logo" alt={process.env.REACT_APP_PROJECT_NAME} />
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>

      <Dashboard></Dashboard>
      
      
      <Footer style={{ textAlign: 'center' }}>©2021</Footer>
    </Layout>
  );
}

export default App;

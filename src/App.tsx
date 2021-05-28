import React from 'react';
import logo from './assets/icon192.png';
import { Layout, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}>
        <img src={logo} className="logo" alt={process.env.REACT_APP_PROJECT_NAME} />
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Dashboard</Menu.Item>
        </Menu>
      </Header>

      <Dashboard></Dashboard>
      
      {/* <Footer style={{ textAlign: 'center' }}>©2021</Footer> */}
    </Layout>
  );
}

export default App;

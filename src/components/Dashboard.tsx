import React from 'react';
import { Content } from 'antd/lib/layout/layout';
import { useWeb3React } from '@web3-react/core';

function Dashboard() {

  const web3 = useWeb3React()
  console.log(web3)
  return (
    <Content className="site-layout">
      <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
        Content
      </div>
    </Content>
  );
}

export default Dashboard;

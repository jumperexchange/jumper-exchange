import React from 'react';
import { Content } from 'antd/lib/layout/layout';
import { useWeb3React } from '@web3-react/core';
import { Table } from 'antd';

const baseWidth = 200;
const columns : Array<any> = [
  {
    title: 'Coin',
    dataIndex: 'coin',
    key: 'coin',
    width: 100,
    fixed: true,
  },
  {
    title: 'Portfolio',
    dataIndex: 'portfolio',
    key: 'portfolio',
    width: baseWidth,
  },
  {
    title: '"Personal Wallet"',
    children: [
      {
        title: 'Ethereum',
        dataIndex: 'w1_eth',
        key: 'w1_eth',
        width: baseWidth,
      },
      {
        title: 'Polygon',
        dataIndex: 'w1_pol',
        key: 'w1_pol',
        width: baseWidth,
      },
      {
        title: 'Binance Smart Chain',
        dataIndex: 'w1_bsc',
        key: 'w1_bsc',
        width: baseWidth,
      },
      {
        title: 'xDai',
        dataIndex: 'w1_dai',
        key: 'w1_dai',
        width: baseWidth,
      },
    ],
  },
  {
    title: 'Add Wallet',
    dataIndex: '',
    key: '',
    width: 100,
  },
];

const data : Array<any> = [];

for (let i = 0; i < 20; i++) {
  data.push({
    key: 0,
    coin: 'USDC',
    portfolio: 10.00,

    w1_eth: 1.00,
    w1_pol: 2.00,
    w1_bsc: 3.00,
    w1_dai: 4.00,
  });
  data.push({
    key: 0,
    coin: 'USDT',
    portfolio: 20.00,

    w1_eth: 2.00,
    w1_pol: 4.00,
    w1_bsc: 6.00,
    w1_dai: 8.00,
  });
  data.push({
    key: 0,
    coin: 'xDai',
    portfolio: 40.00,

    w1_eth: 4.00,
    w1_pol: 8.00,
    w1_bsc: 12.00,
    w1_dai: 16.00,
  });
}

const summary = {
  key: 0,
  coin: 'SUM',
  portfolio: 400.00,

  w1_eth: 40.00,
  w1_pol: 80.00,
  w1_bsc: 120.00,
  w1_dai: 160.00,
}

function Dashboard() {
  const web3 = useWeb3React()

  return (
    <Content className="site-layout">
      <div className="site-layout-background" style={{ minHeight: 'calc(100vh - 64px)'}}>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="middle"
          scroll={{ x: '1000px', y: 'calc(100vh - 200px)' }}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>SUM</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{summary.portfolio}</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{summary.w1_eth}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{summary.w1_pol}</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>{summary.w1_bsc}</Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{summary.w1_dai}</Table.Summary.Cell>
                <Table.Summary.Cell index={6}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </Content>
  );
}

export default Dashboard;

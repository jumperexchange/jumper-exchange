import React from 'react';
import { Content } from 'antd/lib/layout/layout';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Table, TableColumnType } from 'antd';
import './Dashboard.css';

interface Amounts {
  amount_coin: number;
  amount_usd: number;
}

interface Wallet {
  eth: Amounts;
  pol: Amounts;
  bsc: Amounts;
  dai: Amounts;
}

interface Coin {
  name: string;
  img_url: string;
}

interface DataType {
  key: React.Key;
  coin: Coin;
  portfolio: Amounts;

  wallet1: Wallet;
  wallet2?: Wallet;
  wallet3?: Wallet;
}

interface ColomnType extends TableColumnType<DataType> {
  children?: Array<ColomnType>;
}

const data: Array<DataType> = [];

for (let i = 0; i < 20; i += 3) {
  data.push({
    key: i,
    coin: {
      name: 'ETH',
      img_url: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
    },
    portfolio: {
      amount_coin: 22,
      amount_usd: 33,
    },

    wallet1: {
      eth: {
        amount_coin: 22,
        amount_usd: 33,
      },
      pol: {
        amount_coin: 22,
        amount_usd: 33,
      },
      bsc: {
        amount_coin: 22,
        amount_usd: 33,
      },
      dai: {
        amount_coin: 22,
        amount_usd: 33,
      },
    },
  });
  data.push({
    key: i + 1,
    coin: {
      name: 'MATIC',
      img_url: 'https://zapper.fi/images/networks/polygon/0x0000000000000000000000000000000000000000.png',
    },
    portfolio: {
      amount_coin: 22,
      amount_usd: 33,
    },

    wallet1: {
      eth: {
        amount_coin: 22,
        amount_usd: 33,
      },
      pol: {
        amount_coin: 22,
        amount_usd: 33,
      },
      bsc: {
        amount_coin: 22,
        amount_usd: 33,
      },
      dai: {
        amount_coin: 22,
        amount_usd: 33,
      },
    },
  });
  data.push({
    key: i + 2,
    coin: {
      name: 'BNB',
      img_url: 'https://zapper.fi/images/networks/binance-smart-chain/0x0000000000000000000000000000000000000000.png',
    },
    portfolio: {
      amount_coin: 22,
      amount_usd: 33,
    },

    wallet1: {
      eth: {
        amount_coin: 22,
        amount_usd: 33,
      },
      pol: {
        amount_coin: 22,
        amount_usd: 33,
      },
      bsc: {
        amount_coin: 22,
        amount_usd: 33,
      },
      dai: {
        amount_coin: 22,
        amount_usd: 33,
      },
    },
  });
}


function renderGas(wallet: 'wallet1', chain: 'eth' | 'pol' | 'bsc' | 'dai', coinName: string) {
  const coin = data.find(coin => coin.coin.name === coinName)
  const amounts = coin ? coin[wallet][chain] : { amount_coin: 0 }

  return (
    <div className="amounts">
      <div className="amount_coin">{amounts.amount_coin.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {coinName}</div>
    </div>
  )
}

function renderAmounts(amounts: Amounts) {
  return (
    <div className="amounts">
      <div className="amount_coin">{amounts.amount_coin.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
      <div className="amount_usd">{amounts.amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
    </div>
  )
}

function renderCoin(coin: Coin) {
  return (
    <div className="coin">
      <Avatar
        src={coin.img_url}
        alt={coin.name}
      />
    </div>
  )
}

const baseWidth = 200;
const columns: Array<ColomnType> = [
  {
    title: 'Coins',
    fixed: 'left',
    dataIndex: 'coin',
    render: renderCoin,
    width: 60,
  },
  {
    title: 'Portfolio',
    width: baseWidth,
    dataIndex: 'portfolio',
    render: renderAmounts,
  },
  {
    title: '"Personal Wallet" 0x65...de4r',
    children: [
      {
        title: 'Ethereum',
        children: [{
          title: renderGas('wallet1', 'eth', 'ETH'),
          dataIndex: ['wallet1', 'eth'],
          width: baseWidth,
          render: renderAmounts,
        }]
      },
      {
        title: 'Polygon',
        children: [{
          title: renderGas('wallet1', 'pol', 'MATIC'),
          dataIndex: ['wallet1', 'pol'],
          width: baseWidth,
          render: renderAmounts,
        }],
      },
      {
        title: 'Binance Smart Chain',
        children: [{
          title: renderGas('wallet1', 'bsc', 'BNB'),
          dataIndex: ['wallet1', 'bsc'],
          width: baseWidth,
          render: renderAmounts,
        }],
      },
      {
        title: 'xDai',
        children: [{
          title: renderGas('wallet1', 'dai', 'DAI'),
          dataIndex: ['wallet1', 'dai'],
          width: baseWidth,
          render: renderAmounts,
        }],
      },
    ],
  },
  {
    title: 'Add Wallet',
    dataIndex: '',
    width: 100,
  },
];

const summary: DataType = {
  key: 0,
  coin: {
    name: '',
    img_url: '',
  },
  portfolio: {
    amount_coin: 22,
    amount_usd: 33,
  },

  wallet1: {
    eth: {
      amount_coin: 22,
      amount_usd: 33,
    },
    pol: {
      amount_coin: 22,
      amount_usd: 33,
    },
    bsc: {
      amount_coin: 22,
      amount_usd: 33,
    },
    dai: {
      amount_coin: 22,
      amount_usd: 33,
    },
  },
}

function Dashboard() {
  const web3 = useWeb3React()
  console.log(web3)

  return (
    <Content className="site-layout">
      <div className="site-layout-background" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="middle"
          scroll={{ x: '1000px', y: 'calc(100vh - 280px)' }}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>SUM</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{renderAmounts(summary.portfolio)}</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{renderAmounts(summary.wallet1.eth)}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{renderAmounts(summary.wallet1.pol)}</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>{renderAmounts(summary.wallet1.bsc)}</Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{renderAmounts(summary.wallet1.dai)}</Table.Summary.Cell>
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

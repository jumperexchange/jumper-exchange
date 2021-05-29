import React from 'react';
import { Content } from 'antd/lib/layout/layout';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Badge, Button, Modal, Table, TableColumnType, Tooltip } from 'antd';
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

enum ChainName {
  ETH = 'eth',
  POL = 'pol',
  BSC = 'bsc',
  DAI = 'dai',
}

interface ColomnType extends TableColumnType<DataType> {
  children?: Array<ColomnType>;
}

function Dashboard() {
  const showGasModal = (gas: ChainName) => {
    switch (gas) {
      case ChainName.ETH:
        Modal.info({
          title: 'Gas Info for ethereum chain',
          content: (
            <div>
              You need to buy ETH.
            </div>
          )
        })
        break;
      case ChainName.POL:
        Modal.info({
          title: 'Gas Info for Polygon/Matic chain',
          content: (
            <div>
              You need to buy MATIC.
            </div>
          )
        })
        break;
      case ChainName.BSC:
        Modal.info({
          title: 'Gas Info for Binance Smart Chain',
          content: (
            <div>
              You need to buy BNB.
            </div>
          )
        })
        break;
      case ChainName.DAI:
        Modal.info({
          title: 'Gas Info for xDAI chain',
          content: (
            <div>
              You can get some free DAI using those faucets. It should be enough to exchange or move your funds.
              <ul>
                <li><a href="https://xdai-app.herokuapp.com/faucet" target="_blank" rel="nofollow noreferrer">https://xdai-app.herokuapp.com/faucet</a></li>
                <li><a href="https://blockscout.com/xdai/mainnet/faucet" target="_blank" rel="nofollow noreferrer">https://blockscout.com/xdai/mainnet/faucet</a></li>
              </ul>
            </div>
          )
        })
        break;
    }
  }

  const web3 = useWeb3React()
  console.log(web3)


  //// TABLE SETUP
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
  
  function renderGas(wallet: 'wallet1', chain: ChainName, coinName: string) {
    const coin = data.find(coin => coin.coin.name === coinName)
    const amounts = coin ? coin[wallet][chain] : { amount_coin: 0 }
  
    const tooltipsEmpty = {
      [ChainName.ETH]: (<>The Ethereum chain requires ETH to pay for gas. Without it you won't be able to do anything on this chain. <Button type="link" block onClick={() => showGasModal(ChainName.ETH)}>Get ETH</Button></>),
      [ChainName.POL]: (<>The Polygon/Matic chain requires MATIC to pay for gas. Without it you won't be able to do anything on this chain. <Button type="link" block onClick={() => showGasModal(ChainName.POL)}>Get MATIC</Button></>),
      [ChainName.BSC]: (<>The Binance Smart Chain requires BNB to pay for gas. Without it you won't be able to do anything on this chain. <Button type="link" block onClick={() => showGasModal(ChainName.BSC)}>Get BNB</Button></>),
      [ChainName.DAI]: (<>The xDAI chain requires DAI to pay for gas. Without it you won't be able to do anything on this chain. <Button type="link" block onClick={() => showGasModal(ChainName.DAI)}>Get DAI</Button></>),
    }
    const tooltipEmpty = tooltipsEmpty[chain];
    const tooltips = {
      [ChainName.ETH]: (<>The Ethereum chain requires ETH to pay for gas.</>),
      [ChainName.POL]: (<>The Polygon/Matic chain requires MATIC to pay for gas.</>),
      [ChainName.BSC]: (<>The Binance Smart Chain requires BNB to pay for gas.</>),
      [ChainName.DAI]: (<>The xDAI chain requires DAI to pay for gas.</>),
    }
    const tooltip = tooltips[chain];
    return (
      <div className="gas">
        <div className="amount_coin">
          { amounts.amount_coin === 0 ? (
            <Tooltip color="red" title={tooltipEmpty}>
              {coinName}: -
              <Badge size="small" count={'!'} offset={[5, -15]}/>
            </Tooltip>
          ) : (
            <Tooltip title={tooltip}>
              {coinName}: {amounts.amount_coin.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </Tooltip>
          )}
        </div>
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
            title: renderGas('wallet1', ChainName.ETH, 'ETH'),
            dataIndex: ['wallet1', 'eth'],
            width: baseWidth,
            render: renderAmounts,
          }]
        },
        {
          title: 'Polygon',
          children: [{
            title: renderGas('wallet1', ChainName.POL, 'MATIC'),
            dataIndex: ['wallet1', 'pol'],
            width: baseWidth,
            render: renderAmounts,
          }],
        },
        {
          title: 'Binance Smart Chain',
          children: [{
            title: renderGas('wallet1', ChainName.BSC, 'BNB'),
            dataIndex: ['wallet1', 'bsc'],
            width: baseWidth,
            render: renderAmounts,
          }],
        },
        {
          title: 'xDai',
          children: [{
            title: renderGas('wallet1', ChainName.DAI, 'DAI'),
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
  //// END TABLE SETUP

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

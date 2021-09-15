import { BrowserNode } from '@connext/vector-browser-node';
import { Button } from 'antd';
import React, { useState } from 'react';
import * as connext from '../services/connext';
import { formatTokenAmount } from '../services/utils';
import { ChainKey, CoinKey, defaultCoins, findDefaultCoin, getChainByKey } from '../types';

const transferableCoins = [
  findDefaultCoin(CoinKey.DAI),
  findDefaultCoin(CoinKey.USDC),
  findDefaultCoin(CoinKey.USDT),
]
const channelCoins = defaultCoins || transferableCoins

const transferChains = [
  getChainByKey(ChainKey.POL),
  getChainByKey(ChainKey.BSC),
  getChainByKey(ChainKey.DAI),
]

interface StateChannelBalancesProps {
  node: BrowserNode
}

const StateChannelBalances = ({ node }: StateChannelBalancesProps) => {
  const [balances, setBalances] = useState<any>()
  const [loadingBalances, setLoadingBalance] = useState<boolean>(false)

  const updateBalances = async () => {
    setLoadingBalance(true)
    const newBalances: any = {}
    for (const chainId of transferChains.map(chain => chain.id)) {
      newBalances[chainId] = await connext.getChannelBalances(node, chainId);
    }
    console.log(newBalances)
    setBalances(newBalances)
    setLoadingBalance(false)
  }

  if (node && !balances && !loadingBalances) {
    updateBalances()
  }

  return node ? (
    <div>
      Balance on StateChannels: <Button type="link" onClick={() => updateBalances()}>(updateBalances)</Button>
      <table style={{ margin: 'auto' }}>
        <thead className="ant-table-tbody">
          <tr>
            <th className="ant-table-cell"></th>
            {transferChains.map(chain => (
              <td key={chain.key} className="ant-table-cell">{chain.name}</td>
            ))}
          </tr>
        </thead>
        <tbody className="ant-table-tbody">
          {channelCoins.map(coin => (
            <tr key={coin.key} className="ant-table-row">
              <td className="ant-table-cell">{coin.name}</td>
              {transferChains.map(chain => {
                const coinId = coin.chains[chain.key].id
                const balance = balances ? balances[chain.id]?.bob[coinId] : '-'
                return <td key={chain.key} className="ant-table-cell">
                  {formatTokenAmount(coin.chains[chain.key], balance)}
                  <br />
                  <small>{balance}</small>
                </td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <>Connect to Connext to view StateChannel balances</>
  )
}

export default StateChannelBalances;

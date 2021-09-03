import { ArrowUpOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import { switchChain } from '../../services/metamask';
import { mintTokens, testToken } from '../../services/testToken';
import { ChainKey, ChainPortfolio } from '../../types';
import { Chain, getChainByKey } from '../../types/lists';

interface TestBalanceOverviewProps {
  transferChains: Chain[]
  updateBalances: Function
  updatingBalances: boolean
  balances?: { [ChainKey: string]: Array<ChainPortfolio> }
}

const TestBalanceOverview = ({
  transferChains,
  updateBalances,
  updatingBalances,
  balances,
}: TestBalanceOverviewProps) => {
  const web3 = useWeb3React<Web3Provider>()
  const [minting, setMinting] = useState<boolean>(false)

  const mintTestToken = async (chainKey: ChainKey) => {
    if (!web3.library || !web3.account) return
    const chainId = getChainByKey(chainKey).id
    await switchChain(chainId)
    if (web3.chainId !== chainId) return
    setMinting(true)
    try {
      const res = await mintTokens(web3.library?.getSigner(), testToken[chainKey][0].id)
      await res.wait(1)
      await updateBalances(web3.account)
    } finally {
      setMinting(false)
    }
  }

  return (
    <table style={{ background: 'white', margin: 'auto' }}>
      <thead className="ant-table-thead">
        <tr className="ant-table-row">
          <th className="ant-table-cell"></th>
          {transferChains.map((chain) => (
            <th key={chain.key} className="ant-table-cell" style={{ textAlign: 'center' }}>{chain.name}</th>
          ))}
          <th>
            <SyncOutlined onClick={() => updateBalances()} spin={updatingBalances} />
          </th>
        </tr>
      </thead>
      <tbody className="ant-table-tbody" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <tr className="ant-table-row">
          <td className="ant-table-cell">ETH</td>
          {transferChains.map((chain) => (
            <td key={chain.key} className="ant-table-cell">
              <Row gutter={16}>
                <Col xs={24} sm={12} >
                  {balances && balances[chain.key][0].amount.toFixed(4)}
                </Col>
                <Col xs={24} sm={12}>
                  {chain.faucetUrls && (
                    <a href={chain.faucetUrls[0]} target="_blank" rel="nofollow noreferrer">Get {chain.coin} <ArrowUpOutlined rotate={45} /></a>
                  )}
                </Col>
              </Row>
            </td>
          ))}
          <td className="ant-table-cell"></td>
        </tr>
        <tr className="ant-table-row" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <td className="ant-table-cell">TEST</td>
          {transferChains.map((chain) => (
            <td key={chain.key} className="ant-table-cell" >
              <Row gutter={16}>
                <Col xs={24} sm={12} >
                  {balances && balances[chain.key][1].amount.toFixed(4)}
                </Col>
                <Col xs={24} sm={12}>
                  {minting
                    ? <span className="flashing">minting</span>
                    : web3.chainId === chain.id
                      ? <Button type="link" style={{ padding: 0, height: 'auto' }} onClick={() => mintTestToken(chain.key)}>Mint TEST <SettingOutlined /></Button>
                      : <Button type="link" style={{ padding: 0, height: 'auto' }} onClick={() => switchChain(chain.id)}>Change Chain</Button>
                  }
                </Col>
              </Row>
            </td>
          ))}
          <td className="ant-table-cell"></td>
        </tr>
      </tbody>
    </table>
  )
}

export default TestBalanceOverview;







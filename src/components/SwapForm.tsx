import { SwapOutlined } from '@ant-design/icons';
import { SubgraphSyncRecord } from '@connext/nxtp-sdk';
import { useWeb3React } from '@web3-react/core';
import { Button, Col, Input, Row } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import React, { useRef } from 'react';
import { Chain, ChainKey, ChainPortfolio, TokenWithAmounts } from '../types';
import ChainSelect from './ChainSelect';
import TokenSelect from './TokenSelect';
import { injected } from './web3/connectors';

interface SwapFormProps {
  depositChain: ChainKey,
  setDepositChain: Function,
  depositToken?: string,
  setDepositToken: Function,
  depositAmount: number,
  setDepositAmount: Function,

  withdrawChain: ChainKey,
  setWithdrawChain: Function,
  withdrawToken?: string,
  setWithdrawToken: Function,
  withdrawAmount: number,
  setWithdrawAmount: Function,
  estimatedWithdrawAmount: string,

  transferChains: Array<Chain>,
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> },
  balances: { [ChainKey: string]: Array<ChainPortfolio> } | undefined,
  allowSameChains?: boolean,
  forceSameToken?: boolean,
  syncStatus?: Record<number, SubgraphSyncRecord>,
}

const SwapForm = ({
  depositChain,
  setDepositChain,
  depositToken,
  setDepositToken,
  depositAmount,
  setDepositAmount,

  withdrawChain,
  setWithdrawChain,
  withdrawToken,
  setWithdrawToken,
  withdrawAmount,
  setWithdrawAmount,
  estimatedWithdrawAmount,

  transferChains,
  tokens,
  balances,
  allowSameChains,
  forceSameToken,
  syncStatus,
}: SwapFormProps) => {

  const depositSelectRef = useRef<RefSelectProps>()
  const withdrawSelectRef = useRef<RefSelectProps>()

  // Wallet
  const { activate } = useWeb3React()

  const connectWallet = () => {
    activate(injected)
  }

  const onChangeDepositChain = (chainKey: ChainKey) => {
    if (!allowSameChains && withdrawChain === chainKey) {
      setWithdrawChain(depositChain)
      setWithdrawToken(depositToken)
    }
    setDepositChain(chainKey)

    // find same deposit token
    const symbol = tokens[depositChain].find(token => token.id === depositToken)?.symbol
    const tokenId = tokens[chainKey].find(token => token.symbol === symbol)?.id
    setDepositToken(tokenId)
  }

  const onChangeWithdrawChain = (chainKey: ChainKey) => {
    if (!allowSameChains && depositChain === chainKey) {
      setDepositChain(withdrawChain)
      setDepositToken(withdrawToken)
    }
    setWithdrawChain(chainKey)

    // find same withdraw token
    const symbol = tokens[withdrawChain].find(token => token.id === withdrawToken)?.symbol
    const tokenId = tokens[chainKey].find(token => token.symbol === symbol)?.id
    setWithdrawToken(tokenId)
  }

  const getBalance = (chainKey: ChainKey, tokenId: string) => {
    if (!balances) {
      return 0
    }

    const tokenBalance = balances[chainKey].find(portfolio => portfolio.id === tokenId)

    return tokenBalance?.amount || 0
  }

  const onChangeDepositToken = (tokenId: string) => {
    // unselect
    depositSelectRef?.current?.blur()

    // connect
    if (tokenId === 'connect') {
      connectWallet()
      return
    }

    // set token
    setDepositToken(tokenId)
    const balance = getBalance(depositChain, tokenId)
    if (balance < depositAmount && balance > 0) {
      setDepositAmount(Math.floor(balance * 10000) / 10000)
    }

    // set withdraw token?
    if (forceSameToken) {
      const symbol = tokens[depositChain].find(token => token.id === tokenId)?.symbol
      const withdrawToken = tokens[withdrawChain].find(token => token.symbol === symbol)?.id
      setWithdrawToken(withdrawToken)
    }
  }

  const onChangeWithdrawToken = (tokenId: string) => {
    // unselect
    withdrawSelectRef?.current?.blur()

    // connect
    if (tokenId === 'connect') {
      connectWallet()
      return
    }

    // set token
    setWithdrawToken(tokenId)

    // set withdraw token?
    if (forceSameToken) {
      const symbol = tokens[withdrawChain].find(token => token.id === tokenId)?.symbol
      const depositToken = tokens[depositChain].find(token => token.symbol === symbol)?.id
      setDepositToken(depositToken)
    }
  }

  const onChangeDepositAmount = (amount: number) => {
    setDepositAmount(amount)
    setWithdrawAmount(Infinity)
  }
  const onChangeWithdrawAmount = (amount: number) => {
    setDepositAmount(Infinity)
    setWithdrawAmount(amount)
  }
  const formatAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    return parseFloat(e.currentTarget.value)
  }

  const setMaxDeposit = () => {
    const selectedToken = tokens[depositChain].find((token) => token.id === depositToken)
    setDepositAmount(selectedToken?.amount)
  }

  const changeDirection = () => {
    setWithdrawChain(depositChain)
    setDepositChain(withdrawChain)
    setWithdrawToken(depositToken)
    setDepositToken(withdrawToken)
  }

  const hasSufficientBalance = () => {
    if (!depositToken) {
      return true
    }
    return depositAmount <= getBalance(depositChain, depositToken)
  }

  return (
    <>
      <Row gutter={[{ xs: 8, sm: 16 }, { xs: 8, sm: 16 }]}>
        <Col span={10}>
          <div className="form-text">
            From:
          </div>
        </Col>
        <Col span={14}>
          <div className="form-input-wrapper">
            <ChainSelect
              transferChains={transferChains}
              selectedChain={depositChain}
              onChangeSelectedChain={onChangeDepositChain}
              syncStatus={syncStatus}
            />
          </div>
        </Col>

        <Col span={10}>
          <div className="form-input-wrapper">
            <Input
              type="number"
              defaultValue={0.0}
              min={0}
              value={isFinite(depositAmount) && depositAmount >= 0 ? depositAmount : ''}
              onChange={((event) => onChangeDepositAmount(formatAmountInput(event)))}
              placeholder="0.0"
              bordered={false}
              className={!hasSufficientBalance() ? 'insufficient' : ''}
            />
            <Button className="maxButton" type="text" onClick={() => setMaxDeposit()} >MAX</Button>
          </div>
        </Col>
        <Col span={14}>
          <div className="form-input-wrapper">
            <TokenSelect
              tokens={tokens}
              balances={balances}
              selectedChain={depositChain}
              selectedToken={depositToken}
              onChangeSelectedToken={onChangeDepositToken}
              selectReference={depositSelectRef}
              grayed={true}
            />
          </div>
        </Col>
      </Row>

      <Row style={{ margin: 32 }} justify={"center"} >
        <SwapOutlined onClick={() => changeDirection()} />
      </Row>

      <Row gutter={[{ xs: 8, sm: 16 }, { xs: 8, sm: 16 }]}>
        <Col span={10}>
          <div className="form-text">
            To:
          </div>
        </Col>
        <Col span={14}>
          <div className="form-input-wrapper">
            <ChainSelect
              transferChains={transferChains}
              selectedChain={withdrawChain}
              onChangeSelectedChain={onChangeWithdrawChain}
              syncStatus={syncStatus}
            />
          </div>
        </Col>

        <Col span={10}>
          <div className="form-input-wrapper disabled">
            <Input
              type="text"
              defaultValue={0.0}
              min={0}
              value={estimatedWithdrawAmount}
              // value={isFinite(withdrawAmount) ? withdrawAmount : ''}
              onChange={((event) => onChangeWithdrawAmount(formatAmountInput(event)))}
              placeholder="..."
              bordered={false}
              disabled
            />
          </div>
        </Col>
        <Col span={14}>
          <div className="form-input-wrapper">
            <TokenSelect
              tokens={tokens}
              balances={balances}
              selectedChain={withdrawChain}
              selectedToken={withdrawToken}
              onChangeSelectedToken={onChangeWithdrawToken}
              selectReference={withdrawSelectRef}
              grayed={false}
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default SwapForm

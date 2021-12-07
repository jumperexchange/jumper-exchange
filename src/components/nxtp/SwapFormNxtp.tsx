import { SwapOutlined } from '@ant-design/icons'
import { SubgraphSyncRecord } from '@connext/nxtp-sdk'
import { useWeb3React } from '@web3-react/core'
import { Button, Col, Input, Row } from 'antd'
import { RefSelectProps } from 'antd/lib/select'
import BigNumber from 'bignumber.js'
import React, { useEffect, useRef, useState } from 'react'

import { Chain, ChainKey, TokenAmount, TokenWithAmounts } from '../../types'
import ChainSelect from '../ChainSelect'
import TokenSelect from '../TokenSelect'
import { injected } from '../web3/connectors'

interface SwapFormNxtpProps {
  depositChain: ChainKey
  setDepositChain: Function
  depositToken?: string
  setDepositToken: Function
  depositAmount: BigNumber
  setDepositAmount: Function

  withdrawChain: ChainKey
  setWithdrawChain: Function
  withdrawToken?: string
  setWithdrawToken: Function
  withdrawAmount: BigNumber
  setWithdrawAmount: Function
  estimatedWithdrawAmount: string
  totalFees?: BigNumber

  transferChains: Array<Chain>
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> }
  balances: { [ChainKey: string]: Array<TokenAmount> } | undefined
  allowSameChains?: boolean
  forceSameToken?: boolean
  syncStatus?: Record<number, SubgraphSyncRecord>
}

const SwapFormNxtp = ({
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
  totalFees,
}: SwapFormNxtpProps) => {
  const depositSelectRef = useRef<RefSelectProps>()
  const withdrawSelectRef = useRef<RefSelectProps>()
  const [depositAmountString, setDepositAmountString] = useState<string>('')

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
    const symbol = tokens[depositChain].find((token) => token.id === depositToken)?.symbol
    const tokenId = tokens[chainKey].find((token) => token.symbol === symbol)?.id
    setDepositToken(tokenId)
  }

  const onChangeWithdrawChain = (chainKey: ChainKey) => {
    if (!allowSameChains && depositChain === chainKey) {
      setDepositChain(withdrawChain)
      setDepositToken(withdrawToken)
    }
    setWithdrawChain(chainKey)

    // find same withdraw token
    const symbol = tokens[withdrawChain].find((token) => token.id === withdrawToken)?.symbol
    const tokenId = tokens[chainKey].find((token) => token.symbol === symbol)?.id
    setWithdrawToken(tokenId)
  }

  const getBalance = (chainKey: ChainKey, tokenId: string) => {
    if (!balances || !balances[chainKey]) {
      return new BigNumber(0)
    }

    const tokenBalance = balances[chainKey].find((portfolio) => portfolio.id === tokenId)

    return new BigNumber(tokenBalance?.amount || 0)
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
    if (balance.lt(depositAmount) && balance.gt(0)) {
      setDepositAmount(balance)
    }

    // set withdraw token?
    if (forceSameToken) {
      const symbol = tokens[depositChain].find((token) => token.id === tokenId)?.symbol
      const withdrawToken = tokens[withdrawChain].find((token) => token.symbol === symbol)?.id
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
      const symbol = tokens[withdrawChain].find((token) => token.id === tokenId)?.symbol
      const depositToken = tokens[depositChain].find((token) => token.symbol === symbol)?.id
      setDepositToken(depositToken)
    }
  }

  // sync depositAmountString if depositAmount changes
  useEffect(() => {
    if (!new BigNumber(depositAmountString).eq(depositAmount) && depositAmount.gte(0)) {
      setDepositAmountString(depositAmount.toString())
    }
  }, [depositAmount, depositAmountString])

  const onChangeDepositAmount = (amount: string) => {
    setDepositAmountString(amount)
    setDepositAmount(new BigNumber(amount))
    setWithdrawAmount(new BigNumber(Infinity))
  }
  const onChangeWithdrawAmount = (amount: BigNumber) => {
    setDepositAmount(new BigNumber(Infinity))
    setWithdrawAmount(amount)
  }
  const formatAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    return new BigNumber(e.currentTarget.value)
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
    return depositAmount.lte(getBalance(depositChain, depositToken))
  }

  const chainBoxStyle = {
    background: '#2e2e2e',
    border: '1px solid #2e2e2e',
    padding: 12,
    borderRadius: 12,
  }
  const depositAmountNum = new BigNumber(depositAmountString)
  const invalidDepositAmount =
    depositAmountNum.lt(0) ||
    !hasSufficientBalance() ||
    (totalFees && depositAmountNum.minus(totalFees).lt(0))
  return (
    <>
      <Row>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 11 }} style={chainBoxStyle}>
          <Row
            gutter={[
              { xs: 8, sm: 16 },
              { xs: 8, sm: 16 },
            ]}>
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="form-text">FROM</div>
            </Col>
            <Col span={12}>
              <div className="form-input-wrapper">
                <ChainSelect
                  transferChains={transferChains}
                  selectedChain={depositChain}
                  onChangeSelectedChain={onChangeDepositChain}
                  syncStatus={syncStatus}
                />
              </div>
            </Col>

            <Col span={12}>
              <div className={'form-input-wrapper ' + (invalidDepositAmount ? 'invalid' : '')}>
                <Input
                  type="number"
                  defaultValue={0.0}
                  min={0}
                  step={0.000000000000000001}
                  value={depositAmountString}
                  onChange={(event) => onChangeDepositAmount(event.currentTarget.value)}
                  placeholder="0.0"
                  bordered={false}
                  className={invalidDepositAmount ? 'insufficient' : ''}
                />
                <Button className="maxButton" type="text" onClick={() => setMaxDeposit()}>
                  MAX
                </Button>
              </div>
            </Col>
            <Col span={12}>
              <div className="form-input-wrapper">
                <TokenSelect
                  tokens={tokens}
                  balances={balances}
                  selectedChain={depositChain}
                  selectedToken={depositToken}
                  onChangeSelectedToken={onChangeDepositToken}
                  selectReference={depositSelectRef}
                  grayed={true}
                  showBalance={false}
                />
              </div>
            </Col>
          </Row>
          <Row style={{ fontSize: 12, paddingTop: 6 }}>
            <Col span={12}>Min. {totalFees && totalFees.gt(0) ? totalFees.toFixed(4) : '0.0'}</Col>
            <Col
              span={12}
              style={{
                padding: '0 8px',
                display: 'flex',
                justifyContent: 'space-between',
                overflowX: 'hidden',
              }}>
              <div>Balance:</div>
              <div>
                {depositToken &&
                  balances &&
                  new BigNumber(
                    (balances[depositChain] ?? []).find((p) => p.id === depositToken)?.amount || 0,
                  ).toFixed(4)}
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 2 }}>
          <Row style={{ margin: 24 }} justify={'center'}>
            <SwapOutlined
              className="change-swap-direction"
              style={{ fontSize: 28, padding: 10, background: 'rgb(46, 46, 46)', borderRadius: 28 }}
              onClick={() => changeDirection()}
            />
          </Row>
        </Col>

        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 11 }} style={chainBoxStyle}>
          <Row
            gutter={[
              { xs: 8, sm: 16 },
              { xs: 8, sm: 16 },
            ]}>
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="form-text">TO</div>
            </Col>
            <Col span={12}>
              <div className="form-input-wrapper">
                <ChainSelect
                  transferChains={transferChains}
                  selectedChain={withdrawChain}
                  onChangeSelectedChain={onChangeWithdrawChain}
                  syncStatus={syncStatus}
                />
              </div>
            </Col>

            <Col span={12}>
              <div className="form-input-wrapper disabled">
                <Input
                  type="text"
                  defaultValue={0.0}
                  min={0}
                  value={
                    new BigNumber(estimatedWithdrawAmount).gt(0) ? estimatedWithdrawAmount : '...'
                  }
                  // value={isFinite(withdrawAmount) ? withdrawAmount : ''}
                  onChange={(event) => onChangeWithdrawAmount(formatAmountInput(event))}
                  placeholder="..."
                  bordered={false}
                  disabled
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="form-input-wrapper">
                <TokenSelect
                  tokens={tokens}
                  balances={balances}
                  selectedChain={withdrawChain}
                  selectedToken={withdrawToken}
                  onChangeSelectedToken={onChangeWithdrawToken}
                  selectReference={withdrawSelectRef}
                  grayed={false}
                  showBalance={false}
                />
              </div>
            </Col>
          </Row>
          <Row style={{ fontSize: 12, paddingTop: 6 }} justify="end">
            <Col
              span={12}
              style={{
                padding: '0 8px',
                display: 'flex',
                justifyContent: 'space-between',
                overflowX: 'hidden',
              }}>
              <div>Balance:</div>
              <div>
                {withdrawToken &&
                  balances &&
                  new BigNumber(
                    (balances[withdrawChain] ?? []).find((p) => p.id === withdrawToken)?.amount ||
                      0,
                  ).toFixed(4)}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default SwapFormNxtp

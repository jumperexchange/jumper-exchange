import { SwapOutlined } from '@ant-design/icons'
import { SubgraphSyncRecord } from '@connext/nxtp-sdk'
import { useWeb3React } from '@web3-react/core'
import { Badge, Button, Col, Input, Row, Tooltip } from 'antd'
import { RefSelectProps } from 'antd/lib/select'
import BigNumber from 'bignumber.js'
import React, { useEffect, useRef, useState } from 'react'

import { Chain, ChainKey, TokenAmount, TokenWithAmounts } from '../types'
import ChainSelect from './ChainSelect'
import TokenSelect from './TokenSelect'
import { injected } from './web3/connectors'

interface SwapFormProps {
  depositChain?: ChainKey
  setDepositChain: Function
  depositToken?: string
  setDepositToken: Function
  depositAmount: BigNumber
  setDepositAmount: Function

  withdrawChain?: ChainKey
  setWithdrawChain: Function
  withdrawToken?: string
  setWithdrawToken: Function
  withdrawAmount: BigNumber
  setWithdrawAmount: Function
  estimatedWithdrawAmount: string
  estimatedMinWithdrawAmount?: string

  transferChains: Array<Chain>
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> }
  balances: { [ChainKey: string]: Array<TokenAmount> } | undefined
  allowSameChains?: boolean
  forceSameToken?: boolean
  syncStatus?: Record<number, SubgraphSyncRecord>
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
  estimatedMinWithdrawAmount,

  transferChains,
  tokens,
  balances,
  allowSameChains,
  forceSameToken,
  syncStatus,
}: SwapFormProps) => {
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
    if (depositChain) {
      const symbol = tokens[depositChain].find((token) => token.address === depositToken)?.symbol
      const tokenAddress = tokens[chainKey].find((token) => token.symbol === symbol)?.address
      setDepositToken(tokenAddress)
    }
  }

  const onChangeWithdrawChain = (chainKey: ChainKey) => {
    if (!allowSameChains && depositChain === chainKey) {
      setDepositChain(withdrawChain)
      setDepositToken(withdrawToken)
    }
    setWithdrawChain(chainKey)

    // find same withdraw token
    if (withdrawChain) {
      const symbol = tokens[withdrawChain].find((token) => token.address === withdrawToken)?.symbol
      const tokenAddress = tokens[chainKey].find((token) => token.symbol === symbol)?.address
      setWithdrawToken(tokenAddress)
    }
  }

  const getBalance = (chainKey: ChainKey, tokenAddress: string) => {
    if (!balances || !balances[chainKey]) {
      return new BigNumber(0)
    }

    const tokenBalance = balances[chainKey].find((portfolio) => portfolio.address === tokenAddress)

    return tokenBalance?.amount || new BigNumber(0)
  }

  const onChangeDepositToken = (tokenAddress: string) => {
    // unselect
    depositSelectRef?.current?.blur()

    if (!depositChain) return

    // connect
    if (tokenAddress === 'connect') {
      connectWallet()
      return
    }

    // set token
    setDepositToken(tokenAddress)
    const balance = new BigNumber(getBalance(depositChain, tokenAddress))
    if (balance.lt(depositAmount) && balance.gt(0)) {
      setDepositAmount(balance)
    }

    // set withdraw token?
    if (forceSameToken && withdrawChain) {
      const symbol = tokens[depositChain].find((token) => token.address === tokenAddress)?.symbol
      const withdrawToken = tokens[withdrawChain].find((token) => token.symbol === symbol)?.address
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
    if (forceSameToken && depositChain && withdrawChain) {
      const symbol = tokens[withdrawChain].find((token) => token.address === tokenId)?.symbol
      const depositToken = tokens[depositChain].find((token) => token.symbol === symbol)?.address
      setDepositToken(depositToken)
    }
  }

  // sync depositAmountString if depositAmount changes
  useEffect(() => {
    if (!new BigNumber(depositAmountString).eq(depositAmount) && depositAmount.gte(0)) {
      setDepositAmountString(depositAmount.toFixed())
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
    if (depositToken && depositChain) {
      const selectedToken = tokens[depositChain].find((token) => token.address === depositToken)
      if (selectedToken && selectedToken.amount) {
        setDepositAmount(selectedToken.amount)
      }
    }
  }

  const changeDirection = () => {
    setWithdrawChain(depositChain)
    setDepositChain(withdrawChain)
    setWithdrawToken(depositToken)
    setDepositToken(withdrawToken)
  }

  const hasSufficientBalance = () => {
    if (!depositToken || !depositChain) {
      return true
    }
    return depositAmount.lte(getBalance(depositChain, depositToken))
  }

  return (
    <>
      <Row
        gutter={[
          { xs: 8, sm: 16 },
          { xs: 8, sm: 16 },
        ]}>
        <Col span={10}>
          <div className="form-text">From:</div>
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
              step={0.000000000000000001}
              value={depositAmountString}
              onChange={(event) => onChangeDepositAmount(event.currentTarget.value)}
              placeholder="0.0"
              bordered={false}
              className={!hasSufficientBalance() ? 'insufficient' : ''}
            />
            <Button
              className="maxButton"
              type="text"
              disabled={!depositToken}
              onClick={() => setMaxDeposit()}>
              MAX
            </Button>
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

      <Row style={{ margin: 32 }} justify={'center'}>
        <SwapOutlined onClick={() => changeDirection()} />
      </Row>

      <Row
        gutter={[
          { xs: 8, sm: 16 },
          { xs: 8, sm: 16 },
        ]}>
        <Col span={10}>
          <div className="form-text">To:</div>
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
              onChange={(event) => onChangeWithdrawAmount(formatAmountInput(event))}
              placeholder="..."
              bordered={false}
              disabled
            />
            {estimatedMinWithdrawAmount && (
              <Tooltip
                color={'gray'}
                title={`The final amount might change due to slippage but will not fall below ${estimatedMinWithdrawAmount}`}>
                <span className="amountBadge">?</span>
              </Tooltip>
            )}
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

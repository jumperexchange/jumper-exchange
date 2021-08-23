import { SwapOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Col, Input, Row, Select } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import React, { useRef } from 'react';
import { ChainKey, ChainPortfolio, TokenWithAmounts } from '../types';
import { Chain, getChainByKey } from '../types/lists';
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
}: SwapFormProps) => {

  const depositSelectRef = useRef<RefSelectProps>()
  const withdrawSelectRef = useRef<RefSelectProps>()

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
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
    setDepositToken(tokens[chainKey][0].id)
  }

  const onChangeWithdrawChain = (chainKey: ChainKey) => {
    if (!allowSameChains && depositChain === chainKey) {
      setDepositChain(withdrawChain)
      setDepositToken(withdrawToken)
    }
    setWithdrawChain(chainKey)
    setWithdrawToken(tokens[chainKey][0].id)
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

  const changeDirection = () => {
    setWithdrawChain(depositChain)
    setDepositChain(withdrawChain)
    setWithdrawToken(depositToken)
    setDepositToken(withdrawToken)
  }

  const findToken = (chainKey: ChainKey, tokenId: string) => {
    const token = tokens[chainKey].find(token => token.id === tokenId)
    if (!token) {
      throw new Error('Token not found')
    }
    return token
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
            <Avatar
              size="small"
              src={getChainByKey(depositChain).iconUrl}
              alt={getChainByKey(depositChain).name}
            >{getChainByKey(depositChain).name[0]}</Avatar>
            <Select
              placeholder="Select Chain"
              value={depositChain}
              onChange={((v: ChainKey) => onChangeDepositChain(v))}
              bordered={false}
            >
              {transferChains.map(chain => (
                <Select.Option key={chain.key} value={chain.key}>{chain.name}</Select.Option>
              ))}
            </Select>
          </div>
        </Col>

        <Col span={10}>
          <div className="form-input-wrapper">
            <Input
              type="number"
              defaultValue={0.0}
              min={0}
              value={isFinite(depositAmount) ? depositAmount : ''}
              onChange={((event) => onChangeDepositAmount(formatAmountInput(event)))}
              placeholder="0.0"
              bordered={false}
              className={!hasSufficientBalance() ? 'insufficient' : ''}
            />
          </div>
        </Col>
        <Col span={14}>
          <div className="form-input-wrapper">
            <Avatar
              size="small"
              src={depositToken ? findToken(depositChain, depositToken).logoURI : undefined}
              alt={depositToken ? findToken(depositChain, depositToken).name : undefined}
            >{depositToken ? findToken(depositChain, depositToken).name[0] : '?'}</Avatar>
            <Select
              placeholder="Select Coin"
              value={depositToken}
              onChange={((v) => onChangeDepositToken(v))}
              optionLabelProp="data-label"
              bordered={false}
              dropdownStyle={{ minWidth: 300 }}
              showSearch
              ref={(select) => {
                if (select) {
                  depositSelectRef.current = select
                }
              }}
              filterOption={(input, option) => {
                return (option?.label as string || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
            >
              <Select.OptGroup label="Owned Token">
                {!web3.account &&
                  <Select.Option key="Select Coin" value="connect">
                    Connect your wallet
                  </Select.Option>
                }
                {balances && balances[depositChain].length === 0 &&
                  <Select.Option key="No Owned" value="no" disabled={true}>
                    You don't own any token on this chain.
                  </Select.Option>
                }
                {balances && tokens[depositChain].filter(token => token.amount).map(token => (
                  <Select.Option key={'own_' + token.id} value={token.id} label={token.symbol + ' ' + token.name} data-label={token.symbol}>
                    <div className="option-item">
                      <span role="img" aria-label={token.symbol}>
                        <Avatar
                          size="small"
                          src={token.logoURI}
                          alt={token.symbol}
                          style={{ marginRight: 10 }}
                        >{token.symbol[0]}</Avatar>
                      </span>
                      <span className="option-name">{token.symbol} - {token.name}</span>
                      <span className="option-balance">
                        {token.amountRendered}
                      </span>
                    </div>
                  </Select.Option>
                ))}
              </Select.OptGroup>

              <Select.OptGroup label="All Token">
                {tokens[depositChain].map(token => (
                  <Select.Option key={token.id} value={token.id} label={token.symbol + '       - ' + token.name} data-label={token.symbol}>
                    <div className={'option-item ' + (token.amount === 0 ? 'disabled' : '')}>
                      <span role="img" aria-label={token.symbol}>
                        <Avatar
                          size="small"
                          src={token.logoURI}
                          alt={token.symbol}
                          style={{ marginRight: 10 }}
                        >{token.symbol[0]}</Avatar>
                      </span>
                      <span className="option-name">{token.symbol} - {token.name}</span>
                      <span className="option-balance">
                        {token.amountRendered}
                      </span>
                    </div>
                  </Select.Option>
                ))}
              </Select.OptGroup>
            </Select>
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
            <Avatar
              size="small"
              src={getChainByKey(withdrawChain).iconUrl}
              alt={getChainByKey(withdrawChain).name}
            >{getChainByKey(withdrawChain).name[0]}</Avatar>
            <Select
              placeholder="Select Chain"
              value={withdrawChain}
              onChange={((v: ChainKey) => onChangeWithdrawChain(v))}
              bordered={false}
            >
              {transferChains.map(chain => (
                <Select.Option key={chain.key} value={chain.key}>{chain.name}</Select.Option>
              ))}
            </Select>
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
            <Avatar
              size="small"
              src={withdrawToken ? findToken(withdrawChain, withdrawToken).logoURI : undefined}
              alt={withdrawToken ? findToken(withdrawChain, withdrawToken).name : undefined}
            >{withdrawToken ? findToken(withdrawChain, withdrawToken).name[0] : '?'}</Avatar>
            <Select
              placeholder="Select Coin"
              value={withdrawToken}
              onChange={((v) => onChangeWithdrawToken(v))}
              optionLabelProp="data-label"
              bordered={false}
              dropdownStyle={{ minWidth: 300 }}
              showSearch
              ref={(select) => {
                if (select) {
                  withdrawSelectRef.current = select
                }
              }}
              filterOption={(input, option) => {
                return (option?.label as string || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
            >
              <Select.OptGroup label="Owned Token">
                {!web3.account &&
                  <Select.Option key="Select Coin" value="connect">
                    Connect your wallet
                  </Select.Option>
                }
                {balances && balances[withdrawChain].length === 0 &&
                  <Select.Option key="No Owned" value="no" disabled={true}>
                    You don't own any token on this chain.
                  </Select.Option>
                }
                {balances && tokens[withdrawChain].filter(token => token.amount).map(token => (
                  <Select.Option key={'own_' + token.id} value={token.id} label={token.symbol + ' ' + token.name} data-label={token.symbol}>
                    <div className="option-item">
                      <span role="img" aria-label={token.symbol}>
                        <Avatar
                          size="small"
                          src={token.logoURI}
                          alt={token.symbol}
                          style={{ marginRight: 10 }}
                        >{token.symbol[0]}</Avatar>
                      </span>
                      <span className="option-name">{token.symbol} - {token.name}</span>
                      <span className="option-balance">
                        {token.amountRendered}
                      </span>
                    </div>
                  </Select.Option>
                ))}
              </Select.OptGroup>

              <Select.OptGroup label="All Token">
                {tokens[withdrawChain].map(token => (
                  <Select.Option key={token.id} value={token.id} label={token.symbol + ' ' + token.name} data-label={token.symbol}>
                    <div className="option-item">
                      <span role="img" aria-label={token.symbol}>
                        <Avatar
                          size="small"
                          src={token.logoURI}
                          alt={token.symbol}
                          style={{ marginRight: 10 }}
                        >{token.symbol[0]}</Avatar>
                      </span>
                      <span className="option-name">{token.symbol} - {token.name}</span>
                      <span className="option-balance">
                        {token.amountRendered}
                      </span>
                    </div>
                  </Select.Option>
                ))}
              </Select.OptGroup>
            </Select>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default SwapForm

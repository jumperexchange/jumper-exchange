import { Col, Input, RefSelectProps, Row } from 'antd'
import BigNumber from 'bignumber.js'
import { useRef, useState } from 'react'

import { Chain, ChainKey, TokenAmount, TokenWithAmounts } from '../../../types'
import ChainSelect from '../../ChainSelect'
import TokenSelect from '../../TokenSelect'

interface FromSectionCarbonOffsetProps {
  className?: string
  depositChain?: ChainKey
  setDepositChain: Function
  depositToken?: string
  setDepositToken: Function
  depositAmount: BigNumber
  availableChains: Array<Chain>
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> }
  balances: { [ChainKey: string]: Array<TokenAmount> } | undefined
  setDepositAmount: Function
}

export const FromSectionCarbonOffset = (props: FromSectionCarbonOffsetProps) => {
  const depositSelectRef = useRef<RefSelectProps>()

  const [depositAmountString, setDepositAmountString] = useState<string>('')

  const getBalance = (chainKey: ChainKey, tokenAddress: string) => {
    if (!props.balances || !props.balances[chainKey]) {
      return new BigNumber(0)
    }

    const tokenBalance = props.balances[chainKey].find(
      (portfolio) => portfolio.address === tokenAddress,
    )

    return tokenBalance?.amount || new BigNumber(0)
  }

  const onChangeDepositChain = (chainKey: ChainKey) => {
    props.setDepositChain(chainKey)

    // find same deposit token
    if (props.depositChain) {
      const symbol = props.tokens[props.depositChain]?.find(
        (token) => token.address === props.depositToken,
      )?.symbol
      const tokenAddress = props.tokens[chainKey]?.find((token) => token.symbol === symbol)?.address
      props.setDepositToken(tokenAddress)
    }
  }

  const onChangeDepositToken = (tokenAddress: string) => {
    // unselect
    depositSelectRef?.current?.blur()

    if (!props.depositChain) return

    // set token
    props.setDepositToken(tokenAddress)
    const balance = new BigNumber(getBalance(props.depositChain, tokenAddress))
    if (balance.lt(props.depositAmount) && balance.gt(0)) {
      props.setDepositAmount(balance)
    }
  }

  const onChangeDepositAmount = (amount: string) => {
    setDepositAmountString(amount)
    props.setDepositAmount(new BigNumber(amount))
  }

  return (
    <>
      <>
        <Row style={{ marginBottom: 8 }}>
          <Col span={10}>
            <div className="form-text">Retire Carbon With:</div>
          </Col>
        </Row>

        <Row style={{ marginBottom: 8 }} gutter={[0, 0]}>
          <Col span={12}>
            <div className="form-input-wrapper chain-select">
              <ChainSelect
                availableChains={props.availableChains}
                selectedChain={props.depositChain}
                onChangeSelectedChain={onChangeDepositChain}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="form-input-wrapper token-select">
              <TokenSelect
                tokens={props.tokens}
                balances={props.balances}
                selectedChain={props.depositChain}
                selectedToken={props.depositToken}
                onChangeSelectedToken={onChangeDepositToken}
                selectReference={depositSelectRef}
                grayed={true}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="form-input-wrapper">
              <Input
                style={{ height: 50 }}
                type="number"
                defaultValue={0.0}
                min={0}
                step={0.000000000000000001}
                value={depositAmountString}
                onChange={(event) => onChangeDepositAmount(event.currentTarget.value)}
                placeholder="Enter quantity to offset in tonnes"
                bordered={false}
              />
            </div>
          </Col>
        </Row>
      </>
    </>
  )
}

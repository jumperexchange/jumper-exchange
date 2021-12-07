import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Avatar, Select } from 'antd'
import { RefSelectProps } from 'antd/lib/select'
import React from 'react'

import { ChainKey, TokenAmount, TokenWithAmounts } from '../types'

interface TokenSelectProps {
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> }
  balances: { [ChainKey: string]: Array<TokenAmount> } | undefined
  selectedChain?: ChainKey
  selectedToken: string | undefined
  onChangeSelectedToken: Function
  selectReference: React.MutableRefObject<RefSelectProps | undefined>
  grayed: boolean
  showBalance?: boolean
}

const TokenSelect = ({
  tokens,
  balances,
  selectedChain,
  selectedToken,
  onChangeSelectedToken,
  selectReference,
  grayed,
  showBalance = true,
}: TokenSelectProps) => {
  const findToken = (chainKey: ChainKey, tokenId: string) => {
    const token = tokens[chainKey].find((token) => token.id === tokenId)
    if (!token) {
      throw new Error('Token not found')
    }
    return token
  }

  const web3 = useWeb3React<Web3Provider>()
  const token = selectedToken && selectedChain ? findToken(selectedChain, selectedToken) : undefined

  return (
    <>
      <Avatar size="small" src={token?.logoURI} alt={token?.name}>
        {token ? token.name : '?'}
      </Avatar>
      <Select
        placeholder="Select Coin"
        value={selectedToken}
        onChange={(v) => onChangeSelectedToken(v)}
        optionLabelProp="data-label"
        bordered={false}
        dropdownStyle={{ minWidth: 300 }}
        showSearch
        ref={(select) => {
          if (select) {
            selectReference.current = select
          }
        }}
        filterOption={(input, option) => {
          return ((option?.label as string) || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
        }}>
        {/* Separate between Owned and All token if more than 6 */}
        {selectedChain && tokens[selectedChain].length > 6 && (
          <Select.OptGroup label="Owned Token">
            {!web3.account && (
              <Select.Option key="Select Coin" value="connect">
                Connect your wallet
              </Select.Option>
            )}
            {balances && balances[selectedChain] && balances[selectedChain].length === 0 && (
              <Select.Option key="No Owned" value="no" disabled={true}>
                You don't own any token on this chain.
              </Select.Option>
            )}
            {balances &&
              balances[selectedChain] &&
              tokens[selectedChain]
                .filter((token) => token.amount?.gt(0))
                .map((token) => (
                  <Select.Option
                    key={'own_' + token.id}
                    value={token.id}
                    label={token.symbol + ' ' + token.name}
                    data-label={
                      token.symbol +
                      (balances && showBalance && token.amountRendered
                        ? ' (' + token.amountRendered + ')'
                        : '')
                    }>
                    <div className="option-item">
                      <span role="img" aria-label={token.symbol}>
                        <Avatar
                          size="small"
                          src={token.logoURI}
                          alt={token.symbol}
                          style={{ marginRight: 10 }}>
                          {token.symbol[0]}
                        </Avatar>
                      </span>
                      <span className="option-name">
                        {token.symbol} - {token.name}
                      </span>
                      <span className="option-balance">{token.amountRendered}</span>
                    </div>
                  </Select.Option>
                ))}
          </Select.OptGroup>
        )}

        {/* All Token */}
        {selectedChain ? (
          <Select.OptGroup label="All Token">
            {tokens[selectedChain].map((token) => (
              <Select.Option
                key={token.id}
                value={token.id}
                label={token.symbol + ' - ' + token.name}
                data-label={
                  token.symbol +
                  (balances && showBalance && token.amountRendered
                    ? ' (' + token.amountRendered + ')'
                    : '')
                }>
                <div className={'option-item ' + (grayed && token.amount?.eq(0) ? 'disabled' : '')}>
                  <span role="img" aria-label={token.symbol}>
                    <Avatar
                      size="small"
                      src={token.logoURI}
                      alt={token.symbol}
                      style={{ marginRight: 10 }}>
                      {token.symbol[0]}
                    </Avatar>
                  </span>
                  <span className="option-name">
                    {token.symbol} - {token.name}
                  </span>
                  <span className="option-balance">{token.amountRendered}</span>
                </div>
              </Select.Option>
            ))}
          </Select.OptGroup>
        ) : (
          <Select.OptGroup label="Please select a chain first"></Select.OptGroup>
        )}
      </Select>
    </>
  )
}

export default TokenSelect

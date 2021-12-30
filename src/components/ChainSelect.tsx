import { SubgraphSyncRecord } from '@connext/nxtp-sdk'
import { Avatar, Badge, Select } from 'antd'
import React from 'react'

import { Chain, ChainKey, getChainByKey } from '../types'

interface ChainSelectProps {
  transferChains: Array<Chain>
  selectedChain?: ChainKey
  onChangeSelectedChain: Function
  syncStatus?: Record<number, SubgraphSyncRecord>
}

const ChainSelect = ({
  transferChains,
  selectedChain,
  onChangeSelectedChain,
  syncStatus,
}: ChainSelectProps) => {
  const chain = selectedChain ? getChainByKey(selectedChain) : undefined

  return (
    <>
      {chain ? (
        <Avatar size="small" src={chain.logoURI} alt={chain.name}>
          {chain.name[0]}
        </Avatar>
      ) : (
        ''
      )}

      <Select
        placeholder="Select Chain"
        value={selectedChain}
        onChange={(v: ChainKey) => onChangeSelectedChain(v)}
        dropdownStyle={{ minWidth: 300 }}
        bordered={false}
        optionLabelProp="data-label">
        <Select.OptGroup label="Supported Chains">
          {transferChains.map((chain) => (
            <Select.Option
              key={chain.key}
              value={chain.key}
              data-label={
                chain.name + (syncStatus && !syncStatus[chain.id].synced ? ' (Unsynced)' : '')
              }
              disabled={syncStatus && !syncStatus[chain.id].synced}>
              <div className="option-item">
                <span role="img" aria-label={chain.name}>
                  <Avatar
                    size="small"
                    src={chain.logoURI}
                    alt={chain.key}
                    style={{ marginRight: 10 }}>
                    {chain.name[0]}
                  </Avatar>
                </span>
                <span className="option-name">{chain.name}</span>
                <span className="option-balance">
                  {syncStatus && (
                    <Badge
                      color={syncStatus[chain.id].synced ? 'green' : 'orange'}
                      text={syncStatus[chain.id].synced ? 'synced' : 'unsynced'}
                    />
                  )}
                </span>
              </div>
            </Select.Option>
          ))}
        </Select.OptGroup>
      </Select>
    </>
  )
}

export default ChainSelect

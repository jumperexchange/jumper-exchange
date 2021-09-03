import { Avatar, Select } from 'antd';
import React from 'react';
import { ChainKey } from '../types';
import { Chain, getChainByKey } from '../types/lists';

interface ChainSelectProps {
  transferChains: Array<Chain>
  selectedChain: ChainKey
  onChangeSelectedChain: Function
}

const ChainSelect = ({
  transferChains,
  selectedChain,
  onChangeSelectedChain,
}: ChainSelectProps) => {

  const chain = getChainByKey(selectedChain)

  return (
    <>
      <Avatar
        size="small"
        src={chain.iconUrl}
        alt={chain.name}
      >
        {chain.name[0]}
      </Avatar>
      <Select
        placeholder="Select Chain"
        value={selectedChain}
        onChange={((v: ChainKey) => onChangeSelectedChain(v))}
        dropdownStyle={{ minWidth: 300 }}
        bordered={false}
        optionLabelProp="data-label"
      >
        <Select.OptGroup label="Supported Chains">
          {transferChains.map(chain => (
            <Select.Option key={chain.key} value={chain.key} data-label={chain.name}>
              <div className="option-item">
                <span role="img" aria-label={chain.name}>
                  <Avatar
                    size="small"
                    src={chain.iconUrl}
                    alt={chain.key}
                    style={{ marginRight: 10 }}
                  >{chain.name[0]}</Avatar>
                </span>
                <span className="option-name">
                  {chain.name}
                </span>
                <span className="option-balance">
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

import { ChainKey, getChainByKey, StepTool } from '@lifinance/sdk'
import { Avatar, Tooltip } from 'antd'

import { findTool } from '../../types'

export const getChainAvatar = (chainKey: ChainKey) => {
  const chain = getChainByKey(chainKey)
  return (
    <Tooltip title={chain.name}>
      <Avatar size="small" src={chain.logoURI} alt={chain.name}></Avatar>
    </Tooltip>
  )
}

export const getToolAvatar = (toolKey: StepTool) => {
  const tool = findTool(toolKey)
  return (
    <Tooltip title={tool?.name}>
      <Avatar size="small" src={tool?.logoURI} alt={tool?.name}></Avatar>
    </Tooltip>
  )
}

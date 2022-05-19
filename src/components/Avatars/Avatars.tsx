import { ChainKey, getChainByKey, Step } from '@lifinance/sdk'
import { Avatar, Tooltip } from 'antd'

export const getChainAvatar = (chainKey: ChainKey) => {
  const chain = getChainByKey(chainKey)
  return (
    <Tooltip title={chain.name}>
      <Avatar size="small" src={chain.logoURI} alt={chain.name}></Avatar>
    </Tooltip>
  )
}

export const getToolAvatar = (step: Step) => {
  const { toolDetails } = step
  return (
    <Tooltip title={toolDetails.name}>
      <Avatar size="small" src={toolDetails.logoURI} alt={toolDetails.name}></Avatar>
    </Tooltip>
  )
}

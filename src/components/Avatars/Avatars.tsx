import { ChainKey, getChainByKey, Step } from '@lifinance/sdk'
import { Avatar, Tooltip } from 'antd'

import lifiLogo from '../../assets/Li.Fi/LiFi.svg'

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

export const getToolAvatarPrioritizeLifi = (step: Step) => {
  const { toolDetails } = step
  let logo
  if (step.type === 'lifi') {
    logo = lifiLogo
  } else {
    logo = step.toolDetails.logoURI
  }
  return (
    <Tooltip title={toolDetails.name}>
      <Avatar shape="square" size="small" src={logo} alt={toolDetails.name}></Avatar>
    </Tooltip>
  )
}

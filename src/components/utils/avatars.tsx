import { Avatar, Tooltip } from 'antd'

import cbridgeIcon from '../../assets/icons/cbridge.png'
import connextIcon from '../../assets/icons/connext.png'
import harmonyIcon from '../../assets/icons/harmony.png'
import hopIcon from '../../assets/icons/hop.png'
import oneinchIcon from '../../assets/icons/oneinch.png'
import paraswapIcon from '../../assets/icons/paraswap.png'

export const connextAvatar = (
  <Tooltip title="NXTP by Connext">
    <Avatar size="small" src={connextIcon} alt="NXTP"></Avatar>
  </Tooltip>
)

export const hopAvatar = (
  <Tooltip title="Hop">
    <Avatar size="small" src={hopIcon} alt="Hop"></Avatar>
  </Tooltip>
)

export const paraswapAvatar = (
  <Tooltip title="Paraswap">
    <Avatar size="small" src={paraswapIcon} alt="Paraswap"></Avatar>
  </Tooltip>
)

export const oneinchAvatar = (
  <Tooltip title="1inch">
    <Avatar size="small" src={oneinchIcon} alt="1inch"></Avatar>
  </Tooltip>
)

export const horizonAvatar = (
  <Tooltip title="horizon bridge">
    <Avatar size="small" src={harmonyIcon} alt="horizon bridge"></Avatar>
  </Tooltip>
)

export const cbridgeAvatar = (
  <Tooltip title="cBridge">
    <Avatar size="small" src={cbridgeIcon} alt="cBridge"></Avatar>
  </Tooltip>
)

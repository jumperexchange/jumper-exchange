import { Route } from '@lifinance/sdk'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

import { stepReturnInfo } from '../../hooks/useStepReturnInfo'

interface FurtherLinksProps {
  fixedRecipient?: boolean
  routeReturnInfo?: stepReturnInfo
  localRoute?: Route
}
export const FurtherLinks = ({
  fixedRecipient,
  routeReturnInfo,
  localRoute,
}: FurtherLinksProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      {!fixedRecipient && (
        <Link to="/dashboard">
          <Button style={{ fontSize: 12, margin: 8 }} type="link" size="small">
            Dashboard
          </Button>
        </Link>
      )}
      {routeReturnInfo?.receivedTokenMatchesPlannedToken === false &&
        (routeReturnInfo.receivedToken.name.includes('any') ? (
          <Button
            type="link"
            size="small"
            style={{ fontSize: 12, margin: 8 }}
            onClick={() => {
              // eslint-disable-next-line security/detect-non-literal-fs-filename
              window.open(
                `https://multichain.zendesk.com/hc/en-us/articles/4410379722639`,
                '_blank',
              )
            }}>
            Swap to your desired token
          </Button>
        ) : (
          <Button
            type="link"
            size="small"
            style={{ fontSize: 12, margin: 8 }}
            onClick={() => {
              // eslint-disable-next-line security/detect-non-literal-fs-filename
              window.open(
                `https://transferto.xyz/swap?fromChain=${routeReturnInfo?.receivedToken.chainId}&fromToken=${routeReturnInfo?.receivedToken.address}&toChain=${localRoute?.toChainId}&toToken=${localRoute?.toToken.address}`,
                '_blank',
              )
            }}>
            Swap to your desired token
          </Button>
        ))}
    </div>
  )
}

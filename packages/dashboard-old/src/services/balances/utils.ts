import { TokenAmount } from '@lifi/sdk'

import { blockedTokens } from './config'

export const filterBlockedTokenAmounts = (tokenAmounts: TokenAmount[]) => {
  return tokenAmounts.filter(
    ({ chainId, address }) => !(blockedTokens[chainId] && blockedTokens[chainId].includes(address)),
  )
}

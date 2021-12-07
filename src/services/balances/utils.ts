import { TokenAmount } from '@lifinance/types'

import { blockedTokens } from './config'

export const filterBlockedTokenAmounts = (tokenAmounts: TokenAmount[]) => {
  return tokenAmounts.filter(
    ({ chainKey, id }) => !(blockedTokens[chainKey] && blockedTokens[chainKey].includes(id)),
  )
}

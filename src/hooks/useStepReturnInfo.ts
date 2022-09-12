import { Chain, getChainById, Step, Token, TokenAmount } from '@lifi/sdk'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'

import LiFi from '../LiFi'
import { useWallet } from '../providers/WalletProvider'

export interface stepReturnInfo {
  receivedToken: Token
  receivedAmount: BigNumber
  totalBalanceOfReceivedToken: TokenAmount | null
  receivedTokenMatchesPlannedToken: boolean
  toChain: Chain
}

export const useStepReturnInfo = (step: Step) => {
  const { account } = useWallet()
  const [stepReturnInfo, setStepReturnInfo] = useState<stepReturnInfo>()

  const getInfo = useCallback(async () => {
    if (step.execution?.status === 'DONE' && account.address) {
      const receivedToken = step.execution.toToken || step.action.toToken // use action.toToken as fallback in case the receipt parsing on backen fails and returns nothing
      const receivedAmount = new BigNumber(step.execution?.toAmount || '0')
      const totalBalanceOfReceivedToken = await LiFi.getTokenBalance(account.address, receivedToken)
      const receivedTokenMatchesPlannedToken = step.execution.toToken
        ? step.execution.toToken.address === step.action.toToken.address
        : true

      const toChain = getChainById(step.action.toChainId)
      setStepReturnInfo({
        receivedToken,
        receivedAmount,
        totalBalanceOfReceivedToken,
        receivedTokenMatchesPlannedToken,
        toChain,
      })
    }
  }, [step.execution?.status])

  useEffect(() => {
    getInfo()
  }, [step.execution?.status])

  return stepReturnInfo
}

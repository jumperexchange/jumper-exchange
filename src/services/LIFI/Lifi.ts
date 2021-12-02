import {
  RoutesRequest,
  RoutesResponse,
  Step,
  StepTransactionResponse,
  Token,
  TokenAmount,
} from '@lifinance/types'
import axios from 'axios'

import balances from './balances'
import { isRoutesRequest, isStep, isToken } from './typeguards'

class LIFI {
  getRoutes = async (routesRequest: RoutesRequest): Promise<RoutesResponse> => {
    if (!isRoutesRequest(routesRequest)) {
      throw new Error('SDK Validation: Invalid Routs Request')
    }

    const result = await axios.post<RoutesResponse>(
      process.env.REACT_APP_API_URL + 'routes',
      routesRequest,
    )

    return result.data
  }

  getStepTransaction = async (step: Step): Promise<StepTransactionResponse> => {
    if (!isStep(step)) {
      throw new Error('SDK Validation: Invalid Step')
    }

    const result = await axios.post<StepTransactionResponse>(
      process.env.REACT_APP_API_URL + 'steps/transaction',
      step,
    )

    return result.data
  }

  getTokenBalances = async (walletAddress: string, tokens: Token[]): Promise<TokenAmount[]> => {
    if (!walletAddress) {
      throw new Error('SDK Validation: Missing walletAddress')
    }

    if (!tokens.length) {
      throw new Error('SDK Validation: Empty token list passed')
    }

    if (tokens.filter((token) => !isToken(token)).length) {
      throw new Error('SDK Validation: Invalid token passed')
    }

    return balances.getTokenBalances(walletAddress, tokens)
  }

  getTokenBalance = async (walletAddress: string, token: Token): Promise<TokenAmount | null> => {
    if (!walletAddress) {
      throw new Error('SDK Validation: Missing walletAddress')
    }

    if (!isToken(token)) {
      throw new Error('SDK Validation: Invalid token passed')
    }

    return balances.getTokenBalance(walletAddress, token)
  }

  getTokenBalancesForChains = async (
    walletAddress: string,
    tokensByChain: { [chainId: number]: Token[] },
  ): Promise<{ [chainId: number]: TokenAmount[] }> => {
    if (!walletAddress) {
      throw new Error('SDK Validation: Missing walletAddress')
    }

    const tokenList = Object.values(tokensByChain).flat()
    if (!tokenList.length) {
      throw new Error('SDK Validation: Empty token list passed')
    }

    if (tokenList.filter((token) => !isToken(token)).length) {
      throw new Error('SDK Validation: Invalid token passed')
    }

    return balances.getTokenBalancesForChains(walletAddress, tokensByChain)
  }

  // executeRoute = (signer: Signer, route: Route): Promise<Route> => {

  // }

  // getCurrentStatus = (route: Route): Route => {

  // }

  // registerCallback = (callback: (updatedRoute: Route) => void, route?: Route): void => {

  // }

  // deregisterCallback = (callback: (updateRoute: Route) => void, route?: Route): void => {

  // }

  // getActiveExecutions = (): Route[] => {

  // }
}

export default new LIFI()

import {
  PossibilitiesRequest,
  PossibilitiesResponse,
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
  getPossibilities = async (request?: PossibilitiesRequest): Promise<PossibilitiesResponse> => {
    const result = await axios.post<PossibilitiesResponse>(
      process.env.REACT_APP_API_URL + 'possibilities',
      request,
    )

    return result.data
  }

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
      // While the validation fails for some users we should not enforce it
      // eslint-disable-next-line no-console
      console.warn('SDK Validation: Invalid Step', step)
    }

    const result = await axios.post<StepTransactionResponse>(
      process.env.REACT_APP_API_URL + 'steps/transaction',
      step,
    )

    return result.data
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

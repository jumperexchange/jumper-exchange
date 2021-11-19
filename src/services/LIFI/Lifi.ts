import {
  isCrossStep,
  isSwapStep,
  RoutesRequest,
  RoutesResponse,
  Step,
  StepTransactionResponse,
} from '@lifinance/types'
import axios from 'axios'

import { isRoutesRequest, isStep } from './typeguards'

class LIFI {
  getRoutes = async (routesRequest: RoutesRequest): Promise<RoutesResponse> => {
    if (!isRoutesRequest(routesRequest)) {
      throw Error('Invalid routes request')
    }

    const result = await axios.post<RoutesResponse>(
      process.env.REACT_APP_API_URL + 'routes',
      routesRequest,
    )

    return result.data
  }

  getStepTransaction = async (step: Step): Promise<StepTransactionResponse> => {
    if (!isStep(step)) {
      throw Error('Invalid step')
    }

    if (!(isSwapStep(step) || isCrossStep(step))) {
      throw Error('Only swap and cross steps are supported at the moment')
    }

    const result = await axios.post<StepTransactionResponse>(
      process.env.REACT_APP_API_URL + 'steps/transaction',
      step,
    )

    return result.data
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

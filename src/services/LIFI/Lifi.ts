import {
  PossibilitiesRequest,
  PossibilitiesResponse,
  RoutesRequest,
  RoutesResponse,
  Step,
  StepTransactionResponse,
} from '@lifinance/types'
import axios from 'axios'

import { isRoutesRequest, isStep } from './typeguards'

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

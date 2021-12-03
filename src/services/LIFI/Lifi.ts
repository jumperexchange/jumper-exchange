import {
  Route,
  RoutesRequest,
  RoutesResponse,
  Step,
  StepTransactionResponse,
} from '@lifinance/types'
import axios from 'axios'
import { Signer } from 'ethers'

import { StepExecutor } from './executionFiles/StepExecutor'
import { isRoutesRequest, isStep } from './typeguards'

class LIFI {
  private activeRoutes: Route[] = []
  private registeredCallbackFunctions: Record<string, (updatedRoute: Route) => void> = {}

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

  executeRoute = async (signer: Signer, route: Route): Promise<Route> => {
    /*
      loop though steps
        for each step start execution
        if step execution done or fails
      // TODO: add generalized execution Manger class

    */
    // check if route is already running
    const activeRoute = this.activeRoutes.find((activeRoute) => activeRoute.id === route.id)
    if (activeRoute) return activeRoute
    this.activeRoutes.push(route)

    // execute all steps
    // for (const step of route.steps) {
    //   const stepExecutor = new StepExecutor()
    //   stepExecutor.executeStep(signer, step, updateFunction)
    //   this.registeredCallbackFunctions[route.id](route)
    // }

    //clean up after execution
    this.deregisterCallback(this.registeredCallbackFunctions[route.id], route)
    this.activeRoutes = this.activeRoutes.filter((activeRoute) => activeRoute.id !== route.id)
    return route
  }

  stopExecution = (route: Route): Route => {
    return route
  }

  registerCallback = (callback: (updatedRoute: Route) => void, route: Route): void => {
    this.registeredCallbackFunctions[route.id] = callback
  }

  deregisterCallback = (callback: (updateRoute: Route) => void, route: Route): void => {
    delete this.registeredCallbackFunctions[route.id]
  }

  getActiveRoutes = (): Route[] => {
    return this.activeRoutes
  }

  // TODO: implement this function
  // getCurrentStatus = (route: Route): Route => {
  // }
}

export default new LIFI()

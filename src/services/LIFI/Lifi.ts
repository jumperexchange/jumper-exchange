import { JsonRpcSigner } from '@ethersproject/providers'
import {
  PossibilitiesRequest,
  PossibilitiesResponse,
  Route,
  RoutesRequest,
  RoutesResponse,
  Step,
  StepTransactionResponse,
} from '@lifinance/types'
import axios from 'axios'

import { StepExecutor } from './executionFiles/StepExecutor'
import { isRoutesRequest, isStep } from './typeguards'

class LIFI {
  private activeRoutes: Route[] = []

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

  stopExecution = (route: Route): Route => {
    return route
  }

  executeRoute = async (
    signer: JsonRpcSigner,
    route: Route,
    updateFunction: Function,
  ): Promise<Route> => {
    // check if route is already running
    const activeRoute = this.activeRoutes.find((activeRoute) => activeRoute.id === route.id)
    if (activeRoute) return activeRoute
    this.activeRoutes.push(route)

    // loop over steps and execute them
    for (let index = 0; index < route.steps.length; index++) {
      const step = route.steps[index]
      const previousStep = index !== 0 ? route.steps[index - 1] : undefined
      // check if signer is for correct chain
      if ((await signer.getChainId()) !== step.action.fromChainId) {
        // break for loop which stops execution
        break
      }

      // update amount using output of previous execution. In the future this should be handled by calling `updateRoute`
      if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
        step.action.fromAmount = previousStep.execution.toAmount
      }

      const stepExecutor = new StepExecutor()
      await stepExecutor.executeStep(signer, step, updateFunction)
    }

    this.activeRoutes = this.activeRoutes.filter((activeRoute) => activeRoute.id !== route.id)
    return route
  }

  resumeRoute = async (
    signer: JsonRpcSigner,
    route: Route,
    updateFunction: Function,
  ): Promise<Route> => {
    const activeRoute = this.activeRoutes.find((activeRoute) => activeRoute.id === route.id)
    if (activeRoute) return activeRoute
    this.activeRoutes.push(route)

    // loop over steps and execute them
    for (let index = 0; index < route.steps.length; index++) {
      const step = route.steps[index]
      const previousStep = index !== 0 ? route.steps[index - 1] : undefined
      // check if step already done
      if (step.execution && step.execution.status === 'DONE') {
        continue
      }

      // check if signer is for correct chain
      if ((await signer.getChainId()) !== step.action.fromChainId) {
        // break for loop which stops execution
        break
      }

      // update amount using output of previous execution. In the future this should be handled by calling `updateRoute`
      if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
        step.action.fromAmount = previousStep.execution.toAmount
      }

      const stepExecutor = new StepExecutor()
      route.steps[index] = await stepExecutor.executeStep(signer, step, updateFunction)
      // this.registeredCallbackFunctions[route.id](route)
    }

    //clean up after execution
    this.activeRoutes = this.activeRoutes.filter((activeRoute) => activeRoute.id !== route.id)
    return route
  }

  getActiveRoutes = (): Route[] => {
    return this.activeRoutes
  }

  getCurrentStatus = (route: Route): Route => {
    return this.activeRoutes.find((activeRoute) => activeRoute.id === route.id)!
  }
}

export default new LIFI()

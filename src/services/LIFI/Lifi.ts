import { JsonRpcSigner } from '@ethersproject/providers'
import {
  Execution,
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

interface ExecutionData {
  route: Route
  executors: StepExecutor[]
  callbackFunction: Function
}
interface ActiveRouteDictionary {
  [k: string]: ExecutionData
}

class LIFI {
  private activeRoutes: ActiveRouteDictionary = {}

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
    if (!this.activeRoutes[route.id]) return route
    for (const executor of this.activeRoutes[route.id].executors) {
      executor.stopStepExecution()
    }
    delete this.activeRoutes[route.id]
    return route
  }

  executeRoute = async (
    signer: JsonRpcSigner,
    route: Route,
    // updateFunction: Function,
  ): Promise<Route> => {
    // check if route is already running
    if (this.activeRoutes[route.id]) return route
    const execData: ExecutionData = {
      route,
      executors: [],
      callbackFunction: () => {},
    }
    this.activeRoutes[route.id] = execData

    const updateFunction = (step: Step, status: Execution) => {
      step.execution = status
      this.activeRoutes[route.id].callbackFunction(route)
    }

    // loop over steps and execute them
    for (let index = 0; index < route.steps.length; index++) {
      //check if execution has stopped in meantime
      if (!this.activeRoutes[route.id]) return route

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
      this.activeRoutes[route.id].executors.push(stepExecutor)
      await stepExecutor.executeStep(signer, step, updateFunction)
    }

    delete this.activeRoutes[route.id]
    return route
  }

  resumeRoute = async (
    signer: JsonRpcSigner,
    route: Route,
    updateFunction: Function,
  ): Promise<Route> => {
    if (!this.activeRoutes[route.id]) return route
    this.activeRoutes[route.id] = {
      route,
      executors: [],
      callbackFunction: () => {},
    }

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
      this.activeRoutes[route.id].executors.push(stepExecutor)
      await stepExecutor.executeStep(signer, step, updateFunction)
    }

    //clean up after execution
    delete this.activeRoutes[route.id]
    return route
  }

  registerCallback = (callback: (updatedRoute: Route) => void, route: Route): void => {
    this.activeRoutes[route.id].callbackFunction = callback
  }

  deregisterCallback = (callback: (updateRoute: Route) => void, route: Route): void => {
    this.activeRoutes[route.id].callbackFunction = () => {}
  }

  getActiveRoutes = (): Route[] => {
    return Object.values(this.activeRoutes).map((dict) => dict.route)
  }

  getCurrentStatus = (route: Route): Route | undefined => {
    return this.activeRoutes[route.id].route
  }
}

export default new LIFI()

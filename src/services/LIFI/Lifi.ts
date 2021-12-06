import { JsonRpcSigner } from '@ethersproject/providers'
import {
  Execution,
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

  executeRoute = async (signer: JsonRpcSigner, route: Route): Promise<Route> => {
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
      const updateFunction = (step: Step, status: Execution) => {
        step.execution = status
      }
      route.steps[index] = await stepExecutor.executeStep(signer, step, updateFunction)
      this.registeredCallbackFunctions[route.id](route)
    }

    //clean up after execution
    this.deregisterCallback(route)
    this.activeRoutes = this.activeRoutes.filter((activeRoute) => activeRoute.id !== route.id)
    return route
  }

  stopExecution = (route: Route): Route => {
    return route
  }

  resumeRoute = async (signer: JsonRpcSigner, route: Route): Promise<Route> => {
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
      const updateFunction = (step: Step, status: Execution) => {
        step.execution = status
      }
      route.steps[index] = await stepExecutor.executeStep(signer, step, updateFunction)
      this.registeredCallbackFunctions[route.id](route)
    }

    //clean up after execution
    this.deregisterCallback(route)
    this.activeRoutes = this.activeRoutes.filter((activeRoute) => activeRoute.id !== route.id)
    return route
  }

  registerCallback = (callback: (updatedRoute: Route) => void, route: Route): void => {
    this.registeredCallbackFunctions[route.id] = callback
  }

  deregisterCallback = (route: Route): void => {
    delete this.registeredCallbackFunctions[route.id]
  }

  getActiveRoutes = (): Route[] => {
    return this.activeRoutes
  }

  getCurrentStatus = (route: Route): Route => {
    return this.activeRoutes.find((activeRoute) => activeRoute.id === route.id)!
  }

  // checkChain = async (step: Step) => {
  //       const { status, update } = initStatus(
  //         (status: Execution) => updateStatus(step, status),
  //         step.execution,
  //       )
  //       const chain = getChainById(step.action.fromChainId)
  //       const switchProcess = createAndPushProcess(
  //         'switchProcess',
  //         update,
  //         status,
  //         `Change Chain to ${chain.name}`,
  //       )
  //       try {
  //         const switched = await switchChain(step.action.fromChainId)
  //         if (!switched) {
  //           throw new Error('Chain was not switched')
  //         }
  //       } catch (e: any) {
  //         if (e.message) switchProcess.errorMessage = e.message
  //         if (e.code) switchProcess.errorCode = e.code
  //         setStatusFailed(update, status, switchProcess)
  //         setIsSwapping(false)
  //         return false
  //       }
  //       setStatusDone(update, status, switchProcess)
  //       return true
  //     }
}

export default new LIFI()

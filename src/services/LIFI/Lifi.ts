import {RoutesRequest} from './types'
import axios, { CancelTokenSource } from 'axios';
import { TransferStep } from '../../types';

let source: CancelTokenSource | undefined = undefined



export class LIFI {

  findRoutes = async (routeRequest: RoutesRequest) /*: Promise<RoutesResponse> */ => {
    const result = await axios.post<any>(process.env.REACT_APP_API_URL + 'transfer', { routeRequest })
    return result.data as Array<Array<TransferStep>>

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



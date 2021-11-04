import axios from 'axios';
import { DepositAction, TransferStep, WithdrawAction } from '../../types';

class LIFI {

  findRoutes = async (deposit: DepositAction, withdraw: WithdrawAction): Promise<TransferStep[][]>  => {
    const result = await axios.post<any>(process.env.REACT_APP_API_URL + 'transfer', { deposit, withdraw })
    return result.data as TransferStep[][]
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



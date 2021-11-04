import axios from 'axios';
import { DepositAction, TransferStep, WithdrawAction } from '../../types';
import { isDeposit, isWithdraw } from './typeguards';



class LIFI {

  findRoutes = async (deposit: DepositAction, withdraw: WithdrawAction): Promise<TransferStep[][]>  => {
    if(!isDeposit(deposit)){
      throw Error ('Invalid Deposit Type')
    }
    if(!isWithdraw(withdraw)){
      throw Error ('Invalid Withdraw Type')
    }
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



import { DepositAction, Step, WithdrawAction } from '@lifinance/types'
import axios from 'axios'

import { isDeposit, isWithdraw } from './typeguards'

class LIFI {
  findRoutes = async (deposit: DepositAction, withdraw: WithdrawAction): Promise<Step[][]> => {
    if (!isDeposit(deposit)) {
      throw Error('Invalid Deposit Type')
    }
    if (!isWithdraw(withdraw)) {
      throw Error('Invalid Withdraw Type')
    }
    const result = await axios.post<Step[][]>(process.env.REACT_APP_API_URL + 'transfer', {
      deposit,
      withdraw,
    })
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

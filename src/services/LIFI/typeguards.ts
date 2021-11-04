import { DepositAction, WithdrawAction } from "../../types"

export const isDeposit = (deposit: DepositAction): deposit is DepositAction =>{
  return deposit.type === 'deposit' && typeof deposit.chainId === 'number'
}

export const isWithdraw = (withdraw: WithdrawAction): withdraw is WithdrawAction =>{
  return withdraw.type === 'withdraw' && typeof withdraw.chainId === 'number'
}

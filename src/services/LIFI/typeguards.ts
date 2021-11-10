import { DepositAction, WithdrawAction, Token } from "../../types"

/*
  Alternative: https://github.com/rhys-vdw/ts-auto-guard
*/


export const isDeposit = (deposit: DepositAction): deposit is DepositAction =>{
  return (
    deposit.type === 'deposit' &&
    typeof deposit.chainId === 'number' &&
    typeof deposit.amount === 'string' // &&
    // isToken (deposit.token)
    )
}

export const isWithdraw = (withdraw: WithdrawAction): withdraw is WithdrawAction =>{
  return (
    withdraw.type === 'withdraw' &&
    typeof withdraw.chainId === 'number' &&
    typeof withdraw.toAddress === 'string' &&
    typeof withdraw.slippage === 'number' // &&
    // isToken (deposit.token)
  )
}

export const isToken = (token: Token): token is Token => {
  return true
}


  //   // token: Token;
  //   export interface Token {
  //     id: string;
  //     symbol: string;
  //     decimals: number;
  //     chainId: number;
  //     name: string;
  //     chainKey: ChainKey;
  //     key: CoinKey;
  //     logoURI: string;
  // }

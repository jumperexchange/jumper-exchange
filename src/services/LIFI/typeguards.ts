import { ChainKey, CoinKey, DepositAction, Token, WithdrawAction } from '../../types'

export const isDeposit = (deposit: DepositAction): deposit is DepositAction => {
  return (
    deposit.type === 'deposit' &&
    typeof deposit.chainId === 'number' &&
    typeof deposit.amount === 'string' &&
    isToken(deposit.token)
  )
}

export const isWithdraw = (withdraw: WithdrawAction): withdraw is WithdrawAction => {
  return (
    withdraw.type === 'withdraw' &&
    typeof withdraw.chainId === 'number' &&
    typeof withdraw.toAddress === 'string' &&
    typeof withdraw.amount === 'string' &&
    typeof withdraw.slippage === 'number' &&
    isToken(withdraw.token)
  )
}

export const isToken = (token: Token): token is Token => {
  return (
    typeof token.id === 'string' &&
    typeof token.symbol === 'string' &&
    typeof token.decimals === 'number' &&
    typeof token.chainId === 'number' &&
    typeof token.name === 'string' &&
    isChainKey(token.chainKey) &&
    isCoinKey(token.key) &&
    typeof token.logoURI === 'string'
  )
}

export const isChainKey = (chainKey: ChainKey): chainKey is ChainKey => {
  return true
}

export const isCoinKey = (coinKey: CoinKey): coinKey is CoinKey => {
  return true
}

import { JsonRpcSigner } from '@ethersproject/providers'
import { NetworkID, ParaSwap } from 'paraswap'
import { Allowance, OptimalRatesWithPartnerFees, Transaction } from 'paraswap/build/types'

const PARTNER_NAME = 'li.finance'

const instances: {[key: number] : ParaSwap | null} = {
  1: null,
  56: null,
  137: null,
}

const sleep = (mills: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, mills)
  })
}

const getParaswap = (chainId: number) => {
  if (!instances[chainId]) {
    instances[chainId] = new ParaSwap(chainId as NetworkID).setWeb3Provider((window as any).ethereum)
  }
  return instances[chainId] as ParaSwap
}

export const getAllowance = async (chainId: number, userAddress: string, tokenAddress: string) => {
  const para = getParaswap(chainId)
  const result = (await para.getAllowance(userAddress, tokenAddress)) as Allowance

  return parseInt(result.allowance)
}

export const setAllowance = async (chainId: number, userAddress: string, tokenAddress: string, amount: number) => {
  const para = getParaswap(chainId)
  await para.approveToken(amount.toString(), userAddress, tokenAddress);

  let newAllowance = await getAllowance(chainId, userAddress, tokenAddress)
  while (newAllowance !== amount) {
    await sleep(500)
    newAllowance = await getAllowance(chainId, userAddress, tokenAddress)
  }

  return newAllowance
}

export const updateAllowance = async (chainId: number, userAddress: string, tokenAddress: string, amount: number) => {
    const allowance = await getAllowance(chainId, userAddress, tokenAddress)
    if (allowance === amount) {
      return allowance
    }

    // -> set allowance
    if (allowance > 0) {
      await setAllowance(chainId, userAddress, tokenAddress, 0)
    }
    await setAllowance(chainId, userAddress, tokenAddress, amount)
}

export const transfer = async (signer: JsonRpcSigner, chainId: number, userAddress: string, srcToken: string, destToken: string, srcAmount: number, receiver?: string) => {
  const para = getParaswap(chainId)

  const rate = await para.getRate(
    srcToken,
    destToken,
    srcAmount.toString(),
  ) as OptimalRatesWithPartnerFees

  const txParams = await para.buildTx(
    srcToken,
    destToken,
    srcAmount.toString(),
    rate.destAmount,
    rate,
    userAddress,
    PARTNER_NAME,
    receiver ?? userAddress,
  ) as Transaction

  const transaction = {
      from: txParams.from,
      to: txParams.to,
      data: txParams.data,
      chainId: txParams.chainId,
  }
  return signer.sendTransaction(transaction)
}

import ERC20 from '@connext/nxtp-contracts/artifacts/contracts/interfaces/IERC20Minimal.sol/IERC20Minimal.json'
import { IERC20Minimal } from '@connext/nxtp-contracts/typechain'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { Contract } from 'ethers'

import { getChainById, Step, Token, wrappedTokens } from '../types'

export const formatTokenAmount = (token: Token, amount: string | undefined) => {
  if (!amount) {
    return '- ' + token.symbol
  }

  return formatTokenAmountOnly(token, amount) + ' ' + token.symbol
}

export const formatTokenAmountOnly = (token: Token, amount: string | undefined) => {
  if (!amount) {
    return '0.0'
  }

  const floated = new BigNumber(amount).shiftedBy(-token.decimals)

  // show at least 4 decimal places and at least two non-zero digests
  let decimalPlaces = 3
  while (floated.lt(1 / 10 ** decimalPlaces)) decimalPlaces++
  return floated.toFixed(decimalPlaces + 1, 1)
}

export const checkWrappedTokenId = (chainId: number, tokenId: string) => {
  if (tokenId !== '0x0000000000000000000000000000000000000000') {
    return tokenId
  }

  return wrappedTokens[getChainById(chainId).key].address
}

export const deepClone = (src: any) => {
  return JSON.parse(JSON.stringify(src))
}

export const sleep = (mills: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, mills)
  })
}

export const personalizeStep = async (signer: JsonRpcSigner, step: Step): Promise<Step> => {
  if (step.action.toAddress && step.action.fromAddress) return step

  const address = await signer.getAddress()
  const fromAddress = step.action.fromAddress || address
  const toAddress = step.action.toAddress || address

  return {
    ...step,
    action: {
      ...step.action,
      fromAddress,
      toAddress,
    },
  }
}

export const getApproved = async (
  signer: JsonRpcSigner,
  tokenAddress: string,
  contractAddress: string,
) => {
  const signerAddress = await signer.getAddress()
  const erc20 = new Contract(tokenAddress, ERC20.abi, signer) as IERC20Minimal

  try {
    const approved = await erc20.allowance(signerAddress, contractAddress)
    return new BigNumber(approved.toString())
  } catch (e) {
    return new BigNumber(0)
  }
}

export const setApproval = async (
  signer: JsonRpcSigner,
  tokenAddress: string,
  contractAddress: string,
  amount: string,
  // eslint-disable-next-line max-params
) => {
  const erc20 = new Contract(tokenAddress, ERC20.abi, signer) as IERC20Minimal

  const tx = await erc20.approve(contractAddress, amount)
  return tx
}

export const isTransactionMined = async (
  hash: string,
  provider: JsonRpcProvider,
): Promise<boolean> => {
  const txReceipt = await provider.getTransactionReceipt(hash)
  if (txReceipt && txReceipt.blockNumber) {
    return true
  }
  return false
}

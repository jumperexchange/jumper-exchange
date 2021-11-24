import axios from 'axios'
import { ethers } from 'ethers'

import { getRpcProvider } from '../components/web3/connectors'
import { CrossStep, LifiStep } from '../types'
import abi from './ABI/cbridge1.json'
import { sleep } from './utils'

const apiUrl = 'https://cbridge-api.celer.network/v1/'

const getClaimTransaction = async (step: CrossStep | LifiStep) => {
  const provider = getRpcProvider(step.action.fromChainId)
  const contract = new ethers.Contract(step.estimate.approvalAddress, abi, provider)

  const secret = step.estimate.data.secret
  const secretBuf = Buffer.from(JSON.parse(secret).data)

  const tx = await contract.populateTransaction.confirm(
    step.estimate.data.transferOutId, // bytes32 _transferId,
    secretBuf, // bytes32 _preimage
  )

  return tx
}

const markTransferOut = async (step: CrossStep | LifiStep) => {
  interface requestType {
    amount: string
    token: string
    senderAddr: string
    transferOutId: string
    transferInId: string
    fromChainId: number
    toChainId: number
    relayNodeAddr: string
    fee: string
    jwt: string
    hashlockTime: number
  }

  interface responseType {
    err: null
  }

  if (!step.action.fromAddress) {
    throw new Error('cBridge execution requires fromAddress')
  }

  const request: requestType = {
    amount: step.action.fromAmount,
    token: step.action.fromToken.symbol,
    senderAddr: step.action.fromAddress,
    transferOutId: step.estimate.data.transferOutId,
    transferInId: step.estimate.data.transferInId,
    fromChainId: step.action.fromChainId,
    toChainId: step.action.toChainId,
    relayNodeAddr: step.estimate.data.relayNodeAddr,
    fee: step.estimate.data.feeAmount,
    jwt: step.estimate.data.jwt,
    hashlockTime: step.estimate.data.deadline * 1000,
  }

  const { data } = await axios.post<responseType>(apiUrl + 'markTransferOut', request)

  return data
}

const getTransferDetail = async (step: CrossStep | LifiStep) => {
  interface requestType {
    transferId: string[]
  }
  interface resultTransferType {
    transferId: string
    createTime: string
    updateTime: string
    token: string
    amount: string
    sender: string
    receiver: string
    status: 'UNKNOWN_STATUS' | 'NEW' | 'CONFIRMED'
    chainId: string
    hashlock: string
    trasferType: string
    timelock: string
    dstChainId: string
    fee: string
  }
  interface resultType {
    err: null
    transfers: {
      [id: string]: resultTransferType
    }
  }

  const request: requestType = {
    transferId: [step.estimate.data.transferOutId, step.estimate.data.transferInId],
  }

  const { data } = await axios.post<resultType>(apiUrl + 'getTransferDetail', request)

  return data
}

const userSendConfirm = async (step: CrossStep | LifiStep, txHash: string) => {
  interface requestType {
    chainId: number
    transferId: string
    txHash: string
  }
  interface resultType {
    err: null
  }

  const request: requestType = {
    chainId: step.action.fromChainId,
    transferId: step.estimate.data.transferOutId,
    txHash: txHash,
  }

  const { data } = await axios.post<resultType>(apiUrl + 'userSendConfirm', request)

  return data
}

const checkTransferConfirmable = async (step: CrossStep | LifiStep) => {
  interface requestType {
    transferId: string
  }
  interface resultType {
    err: null
    confirmable: boolean
  }

  const request: requestType = {
    transferId: step.estimate.data.transferOutId,
  }

  const { data } = await axios.post<resultType>(apiUrl + 'checkTransferConfirmable', request)

  return data.confirmable
}

const waitForClaim = async (step: CrossStep | LifiStep) => {
  // loop
  while (true) {
    // get Details
    const details = await getTransferDetail(step).catch(() => undefined)

    // check Result
    if (
      details &&
      details.transfers[step.estimate.data.transferOutId] &&
      details.transfers[step.estimate.data.transferInId] &&
      (await checkTransferConfirmable(step))
    ) {
      return details
    }

    // Wait until next call
    await sleep(10 * 1000)
  }
}

const waitForCompletion = async (step: CrossStep | LifiStep) => {
  // loop
  while (true) {
    // get Details
    const details = await getTransferDetail(step).catch(() => undefined)

    // check Result
    if (
      details &&
      details.transfers[step.estimate.data.transferOutId] &&
      details.transfers[step.estimate.data.transferOutId].status === 'CONFIRMED' &&
      details.transfers[step.estimate.data.transferInId] &&
      details.transfers[step.estimate.data.transferInId].status === 'CONFIRMED'
    ) {
      return details
    }

    // Wait until next call
    await sleep(10 * 1000)
  }
}

const cbridge1 = {
  markTransferOut,
  getTransferDetail,
  waitForClaim,
  getClaimTransaction,
  userSendConfirm,
  waitForCompletion,
}

export default cbridge1

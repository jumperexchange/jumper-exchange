import axios from 'axios'
import { ethers } from 'ethers'

import { getRpcProvider } from '../components/web3/connectors'
import { CrossStep, LifiStep } from '../types'
import { sleep } from './utils'

const apiUrl = 'https://cbridge-v2-prod.celer.network/v1/'

enum TransferHistoryStatus {
  TRANSFER_UNKNOWN = 0,
  TRANSFER_SUBMITTING = 1,
  TRANSFER_FAILED = 2,
  TRANSFER_WAITING_FOR_SGN_CONFIRMATION = 3,
  TRANSFER_WAITING_FOR_FUND_RELEASE = 4,
  TRANSFER_COMPLETED = 5,
  TRANSFER_TO_BE_REFUNDED = 6,
  TRANSFER_REQUESTING_REFUND = 7,
  TRANSFER_REFUND_TO_BE_CONFIRMED = 8,
  TRANSFER_CONFIRMING_YOUR_REFUND = 9,
  TRANSFER_REFUNDED = 10,
}

enum XferStatus {
  UNKNOWN = 0,
  OK_TO_RELAY = 1,
  SUCCESS = 2,
  BAD_LIQUIDITY = 3,
  BAD_SLIPPAGE = 4,
  BAD_TOKEN = 5,
  REFUND_REQUESTED = 6,
  REFUND_DONE = 7,
  BAD_XFER_DISABLED = 8,
  BAD_DEST_CHAIN = 9,
}

type cChain = {
  id: number
  name: string
  icon: string
  block_delay: number
  gas_token_symbol: string
  explore_url: string
  rpc_url: string
  contract_addr: string
}

type cToken = {
  symbol: string
  address: string
  decimal: number
  xfer_disabled: boolean
}

type cTransferInfo = {
  chain?: cChain
  token?: cToken
  amount: string
}
type cTransferHistory = {
  transfer_id: string
  src_send_info?: cTransferInfo
  dst_received_info?: cTransferInfo
  ts: number
  src_block_tx_link: string
  dst_block_tx_link: string
  status: TransferHistoryStatus
  refund_reason: XferStatus
}

const getTransferHistory = async (userAddress: string) => {
  interface resultType {
    err: null
    current_size: string
    history: cTransferHistory[]
    next_page_token: string
  }

  const params = {
    addr: userAddress,
    page_size: 50,
    next_page_token: undefined,
  }
  const { data } = await axios.get<resultType>(apiUrl + 'transferHistory', { params })

  return data.history
}

const waitForCompletion = async (step: CrossStep | LifiStep): Promise<cTransferHistory> => {
  // loop
  while (true) {
    // get Details
    const history = await getTransferHistory(step.action.fromAddress!).catch(() => [])
    const details = history.find((entry) => entry.transfer_id === step.estimate.data.transferId)

    // check Result
    if (details && details.status === TransferHistoryStatus.TRANSFER_COMPLETED) {
      return details
    }

    // Wait until next call
    await sleep(10 * 1000)
  }
}

const waitForDestinationChainReceipt = async (
  step: CrossStep | LifiStep,
): Promise<ethers.providers.TransactionReceipt> => {
  const history = await waitForCompletion(step)

  try {
    const urlParts = history.dst_block_tx_link.split('/')
    const txHash = urlParts[urlParts.length - 1]
    const rpc = getRpcProvider(step.action.toChainId)
    const tx = await rpc.getTransaction(txHash)
    const receipt = await tx.wait()
    return receipt
  } catch (e) {
    // transaction may not be included in our RPC yet
    return waitForDestinationChainReceipt(step)
  }
}

const cbridge = {
  waitForDestinationChainReceipt,
}

export default cbridge

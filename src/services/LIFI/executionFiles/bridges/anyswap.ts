import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import axios from 'axios'

import { sleep } from '../../utils'
import { getRpcProvider } from '../../web3/connectors'

const apiUri = 'https://bridgeapi.anyswap.exchange'

const waitForDestinationChainReceipt = async (
  txHash: string,
  toChainId: number,
): Promise<TransactionReceipt> => {
  // loop
  while (true) {
    // get Details
    const details = await getTransferStatus(txHash).catch(() => undefined)

    // check Result
    if (details && details.info.swaptx) {
      try {
        const txHash = details.info.swaptx
        const rpc = getRpcProvider(toChainId)
        const tx = await rpc.getTransaction(txHash)
        const receipt = await tx.wait()
        return receipt
      } catch (e) {
        //
      }
    }

    // Wait until next call
    await sleep(10 * 1000)
  }
}

// transaction status
// e.g. https://bridgeapi.anyswap.exchange/v2/history/details?params=0x7f172664ca3dc4a003d7da37d01d2e84e94425fd3f8aa33f01990ee1e16e6525
const getTransferStatus = async (txHash: string) => {
  interface ResponseType {
    msg: 'Success' | 'Error'
    info: {
      _id: string
      txid: string
      from: string
      value: string
      formatvalue: number
      status: number
      bind: string
      srcChainID: string
      destChainID: string
      historyType: 'STABLEV3' | string
      pairid: string
      timestamp: number
      statusmsg: 'TxNotStable' | 'MatchTxStable' | string
      swapinfo: {
        routerSwapInfo: {
          token: string
          tokenID: string
        }
      }
      swaptype: number
      txto: string

      // finished
      formatswapvalue?: number
      swapvalue?: string
      to?: string
      txheight?: string
      confirmations?: string
      swapheight?: number
      swapnonce?: number
      swaptx?: string
      time?: number
      formatfee?: number
    }
  }
  try {
    const params = {
      params: txHash,
    }
    const result = await axios.get<ResponseType>(apiUri + '/v2/history/details', { params })

    if (result.data.msg === 'Success') {
      return result.data
    } else {
      return undefined
    }
  } catch (e) {
    // console.warn(`AnySwap.getTransferStatus failed for txHash: ${txHash}`)
    return undefined
  }
}

// register transfer (this api is used by anyswap to register pending transaction, but access from other domains is forbidden)
// e.g. POST https://bridgeapi.anyswap.exchange/v3/records
// FormData:
// hash: 0x14b68513d2eb1bd121a4a07e257927bcb67ccd79e038a2ead8fc4f01ebf6428c
// srcChainID: 137
// destChainID: 250
// token: 0x4f3aff3a747fcade12598081e80c6605a8be192f
// from: 0x552008c0f6870c2f77e5cc1d2eb9bdff03e30ea0
// version: STABLEV3
// value: 12000000
// formatvalue: 12
// to: 0x552008c0f6870c2f77e5cc1d2eb9bdff03e30ea0
// symbol: USDC
// userAgent: Mozilla / 5.0(Macintosh; Intel Mac OS X 10_15_7) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 95.0.4638.69 Safari / 537.36
// const registerTransfer = async (txHash: string, step: Step) => {
//   interface ResponseType {
//     msg: 'Success' | 'Error'
//     info: 'Success'
//   }
//   try {
//     const body = QueryString.stringify({
//       hash: txHash,
//       srcChainID: step.action.fromChainId.toString(),
//       destChainID: step.action.toChainId.toString(),
//       token: step.estimate.data.transferTokenAddress,
//       from: step.action.fromAddress!,
//       version: step.estimate.data.version,
//       value: step.action.fromAmount,
//       formatvalue: step.estimate.data.formatvalue,
//       to: step.action.toAddress!,
//       symbol: step.action.fromToken.symbol,
//       userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
//     })

//     const config = {
//       headers: {
//         'content-type': 'application/x-www-form-urlencoded'
//       }
//     }

//     const result = await axios.post<ResponseType>(
//       apiUri + '/v3/records',
//       body,
//       config
//     )

//     if (result.data.msg === 'Success') {
//       return true
//     } else {
//       return false
//     }
//   } catch (e) {
//     //console.warn(`AnySwap.registerTransfer failed for txHash: ${txHash}`)
//     return false
//   }
// }

const parseReceipt = (tx: TransactionResponse, receipt: TransactionReceipt) => {
  const result = {
    fromAmount: '0',
    toAmount: '0',
    gasUsed: '0',
    gasPrice: '0',
    gasFee: '0',
  }
  // const decoder = new ethers.utils.AbiCoder()

  // gas
  result.gasUsed = receipt.gasUsed.toString()
  result.gasPrice = tx.gasPrice?.toString() || '0'
  result.gasFee = receipt.gasUsed.mul(result.gasPrice).toString()

  // log
  // const boondedLog = receipt.logs.find((log) => log.address === receipt.to) // info about initial funds
  // const receivedLog = receipt.logs[2] // info about received funds
  // if (boondedLog) {
  //   const parsed = decoder.decode(bondedContractTypes, boondedLog.data) as unknown as BondedSwapped
  //   result.fromAmount = parsed.amount.toString()
  // }
  // if (receivedLog) {
  //   const parsed = decoder.decode(
  //     receivedContractTypes,
  //     receivedLog.data,
  //   ) as unknown as ReceivedSwapped
  //   result.toAmount = parsed.value.toString()
  // }
  return result
}

const anyswap = {
  waitForDestinationChainReceipt,
  parseReceipt,
}

export default anyswap

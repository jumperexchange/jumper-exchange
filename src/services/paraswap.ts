import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import axios, { AxiosRequestConfig } from 'axios'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, ethers } from 'ethers'
import { NetworkID, ParaSwap, SwapSide } from 'paraswap'
import { OptimalRate } from 'paraswap-core'
import { APIError, Transaction } from 'paraswap/build/types'
import { SwapAction, SwapEstimate } from '../types'

// event Swapped(
//   bytes16 uuid,
//   address initiator,
//   address indexed beneficiary,
//   address indexed srcToken,
//   address indexed destToken,
//   uint256 srcAmount,
//   uint256 receivedAmount,
//   uint256 expectedAmount
// )
const swappedTypes: Array<ethers.utils.ParamType> = [
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "bytes16",
    "name": "uuid",
    "type": "bytes16"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "address",
    "name": "initiator",
    "type": "address"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "srcAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "receivedAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "expectedAmount",
    "type": "uint256"
  }),
]
interface Swapped {
  initiator: string
  srcAmount: BigNumber
  receivedAmount: BigNumber
  expectedAmount: BigNumber
  referrer: string
}

const checkTokenAddress = (address: string) => {
  if (address === '0x0000000000000000000000000000000000000000') {
    return '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  }
  return address
}

const getParaswap = (chainId: number) => {
  return new ParaSwap(chainId as NetworkID)
}

const getContractAddress = async (chainId: number) => {
  const para = getParaswap(chainId)
  const result = await para.getTokenTransferProxy()
  if (result.hasOwnProperty('message')) {
    throw new Error((result as APIError).message)
  } else {
    return result as string
  }
}

const getRateTs = async (
  chainId: number,
  srcToken: string,
  destToken: string,
  amount: string,
  side: SwapSide = SwapSide.SELL,
  options: any = {},
  srcDecimals?: number,
  destDecimals?: number,
): Promise<OptimalRate> => {
  const paraSwap = getParaswap(chainId)
  const priceRoute = await paraSwap.getRate(
    checkTokenAddress(srcToken),
    checkTokenAddress(destToken),
    amount,
    undefined, // userAddress?: Address,
    side,
    options,
    srcDecimals,
    destDecimals,
  )

  if (priceRoute.hasOwnProperty('message')) {
    throw new Error((priceRoute as APIError).message)
  } else {
    return priceRoute as OptimalRate
  }
}

const getSwapCallSdk = async (swapAction: SwapAction, swapEstimate: SwapEstimate, srcAddress: string, destAddress: string) => {
  const para = getParaswap(swapAction.chainId)
  const rate = swapEstimate.data as OptimalRate
  const minAmount = new BigNumber(rate.destAmount).times(1 - swapAction.slippage).toFixed(0)

  let txParams = await para.buildTx(
    rate.srcToken, // srcToken: Address,
    rate.destToken,// destToken: Address,
    rate.srcAmount, // srcAmount: PriceString,
    minAmount, // destAmount: PriceString,
    rate, // priceRoute: OptimalRate,
    srcAddress, // userAddress: Address,
    undefined, // rate.partner, // partner?: string,
    undefined, // partnerAddress?: string,
    undefined, // rate.partnerFee, // partnerFeeBps?: number,
    destAddress, // receiver?: Address,
    {
      ignoreChecks: true, // ignoreChecks?: boolean;
      // ignoreGasEstimate?: boolean;
      // onlyParams?: boolean;
      // simple?: boolean;
      // gasPrice?: PriceString;
    },
    rate.srcDecimals,
    rate.destDecimals,
    // permit?: string,
    // deadline?: string
  )

  if (txParams.hasOwnProperty('message')) {
    throw new Error((txParams as APIError).message)
  } else {
    txParams = txParams as Transaction
  }

  return {
    from: txParams.from,
    to: txParams.to,
    data: txParams.data,
    chainId: txParams.chainId,
    value: BN.from(txParams.value),
  } as ethers.PopulatedTransaction
}

const getSwapCall = async (swapAction: SwapAction, swapEstimate: SwapEstimate, srcAddress: string, destAddress: string) => {
  const rate = swapEstimate.data as OptimalRate
  const minAmount = new BigNumber(rate.destAmount).times(1 - swapAction.slippage).toFixed(0)

  const data = {
    // srcToken: string Destination Token Address.Only Token Symbol could be speciﬁed for tokens from / tokens.
    srcToken: rate.srcToken,
    // srcDecimals: integer - Source Token Decimals. (Can be omitted if Token Symbol is provided for srcToken).
    srcDecimals: rate.srcDecimals,
    // destToken: string - Destination Token Address.Only Token Symbol could be speciﬁed for tokens from / tokens.
    destToken: rate.destToken,
    // destDecimals: integer - Destination Token Decimals. (Can be omitted if Token Symbol is provided for destToken).
    destDecimals: rate.destDecimals,
    // srcAmount: integer - Source Amount with decimals.Required if side = SELL.Could only be omitted if slippage is provided when side = BUY
    srcAmount: rate.srcAmount,
    // destAmount: integer - Destination amount with decimals.Required if side = BUY.Could only be omitted if slippage is provided when side = SELL.
    destAmount: minAmount,
    // priceRoute: object - priceRoute from response body returned from / prices endpoint.priceRoute should be sent exactly as it was returned by the / prices endpoint.
    priceRoute: rate,
    // slippage: integer - Allowed slippage percentage represented in basis points.
    // userAddress: string - Address of the caller of the transaction(msg.sender)
    userAddress: srcAddress,
    // txOrigin: string - Whenever msg.sender(userAddress) i.e.address calling the ParaSwap contract is different than the address sending the transaction, txOrigin must be passed along with userAddress.
    txOrigin: srcAddress,
    // receiver: string - Address of the Receiver(that will receive the output of the swap).Used for Swap & Transfer.
    receiver: destAddress
    // partnerAddres: string - Partner Address.If provided, takes precedence over partner parameter.
    // partnerFeeBps: string - If provided it is used together with partnerAddress.Should be in basis points percentage.Look at slippage parameter description for understanding better. Eg: 200(for 2 % fee percent)
    // partner: string - Partners who are registered with ParaSwap can pass the partne: string instead of passing the partnerAddress and partnerFeeBps. -     permit: string - Hex string for the signature used for Permit.This can be used to avoid giving approval.Helps in saving gas.
    // deadline: integer -   Timestamp(10 digit / seconds precision) till when the given transaction is valid.For a deadline of 5 minute, deadline: Math.floor(Date.now() / 1000) + 300 E.g.: 1629214486
  }
  const config: AxiosRequestConfig = {
    params: {
      ignoreChecks: true, // do not check if the wallet has to token already
    }
  }
  const result = await axios.post<any>(`https://apiv5.paraswap.io/transactions/${swapAction.chainId}/`, data, config)

  return {
    from: result.data.from,
    to: result.data.to,
    data: result.data.data,
    chainId: result.data.chainId,
    value: BN.from(result.data.value),
  } as ethers.PopulatedTransaction
}

const buildTransaction = async (swapAction: SwapAction, swapEstimate: SwapEstimate, srcAmount: BigNumber, srcAddress: string, destAddress: string) => {
  // get new quote if outdated (eg. after transfer)
  if (!srcAmount.isEqualTo(swapEstimate.data.srcAmount)) {
    swapEstimate.data = await getRateTs(swapAction.chainId, swapAction.token.id, swapAction.toToken.id, srcAmount.toFixed(0), SwapSide.SELL, {}, swapAction.token.decimals, swapAction.toToken.decimals)
  }

  return getSwapCall(swapAction, swapEstimate, srcAddress, destAddress)
}

const parseReceipt = (tx: TransactionResponse, receipt: TransactionReceipt) => {
  const result = {
    fromAmount: '0',
    toAmount: '0',
    gasUsed: '0',
    gasPrice: '0',
    gasFee: '0',
  }

  // gas
  result.gasUsed = receipt.gasUsed.toString()
  result.gasPrice = tx.gasPrice?.toString() || '0'
  result.gasFee = receipt.gasUsed.mul(result.gasPrice).toString()

  // log
  const decoder = new ethers.utils.AbiCoder()
  receipt.logs
    .filter((log) => log.address === receipt.to)
    .forEach((log) => {
      try {
        const parsed = decoder.decode(swappedTypes, log.data) as unknown as Swapped
        result.fromAmount = parsed.srcAmount.toString()
        result.toAmount = parsed.receivedAmount.toString()
      } catch (e) {
        // find right log by trying to parse them
      }
    })

  return result
}

export const paraswap = {
  getContractAddress,
  getSwapCallSdk,
  getSwapCall,
  buildTransaction,
  parseReceipt,
}

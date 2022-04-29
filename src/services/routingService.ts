import { Route, RoutesRequest } from '@lifinance/sdk'
import { ethers, providers, Signer } from 'ethers'

import { erc20Abi } from '../constants'
import LiFi from '../LiFi'
import { isZeroAddress } from './utils'

const getRoute = async (
  request: RoutesRequest,
  signer?: Signer,
): Promise<Route[] | providers.TransactionRequest[]> => {
  if (request.fromAddress !== request.toAddress && signer) {
    if (
      request.fromTokenAddress === request.toTokenAddress &&
      request.fromChainId === request.toChainId
    ) {
      const tx = getSimpleTransfer(request, signer)
      return tx
    }
    return getLIFIRoute(request)
  }
  return getLIFIRoute(request)
}

const getSimpleTransfer = async (request: RoutesRequest, signer: Signer) => {
  let tx: providers.TransactionRequest
  if (isZeroAddress(request.fromTokenAddress)) {
    tx = {
      from: request.fromAddress,
      to: request.toAddress,
      value: request.fromAmount,
      gasLimit: 100000,
      gasPrice: await signer.getGasPrice(),
    }
  } else {
    let contract = new ethers.Contract(request.fromTokenAddress, erc20Abi, signer)
    tx = await contract.populateTransaction.transfer(request.toAddress, request.fromAmount)
  }
  return [tx]
}

const getLIFIRoute = async (request: RoutesRequest) => {
  const routeReponse = await LiFi.getRoutes(request)
  return routeReponse.routes
}

export default getRoute

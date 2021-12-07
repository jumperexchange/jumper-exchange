/* eslint-disable no-console */
import { ChainId, ChainKey, CoinKey, findDefaultCoinOnChain, RoutesRequest } from '@lifinance/types'
import { Wallet } from 'ethers'

import Lifi from './Lifi'
import { getRpcProvider } from './web3/connectors'

jest.setTimeout(600_000)

// Execute real transfer on chain if SEED is provided
describe.skip('LiFi SDK', () => {
  it('should run automatically', async () => {
    // get Route
    const routeRequest: RoutesRequest = {
      fromChainId: ChainId.POL,
      fromAmount: '1000000',
      fromTokenAddress: findDefaultCoinOnChain(CoinKey.USDT, ChainKey.POL).id,
      toChainId: ChainId.DAI,
      toTokenAddress: findDefaultCoinOnChain(CoinKey.USDT, ChainKey.DAI).id,
      options: { slippage: 0.03 },
    }
    const routeResponse = await Lifi.getRoutes(routeRequest)
    const route = routeResponse.routes[0]
    console.log({ route })

    // > set `export SEED="..."`
    expect(process.env.SEED).toBeDefined()
    const provider = getRpcProvider(ChainId.POL)
    const wallet = Wallet.fromMnemonic(process.env.SEED!).connect(provider)

    // execute Route
    const finalRoute = await Lifi.executeRoute(wallet, route, (step, execution) =>
      console.log(execution),
    )
    const lastStep = finalRoute.steps[finalRoute.steps.length - 1]
    expect(lastStep.execution?.status).toEqual('DONE')
  })
})

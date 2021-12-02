import { FallbackProvider } from '@ethersproject/providers'
import { Token, TokenAmount } from '@lifinance/types'
// @ts-ignore
import { createWatcher } from '@makerdao/multicall'
import BigNumber from 'bignumber.js'
import { BigNumber as BN, constants, Contract } from 'ethers'

import {
  getMulticallAddresse,
  getRpcProvider,
  getRpcUrl,
} from '../../../components/web3/connectors'

type UpdateType = {
  type: string
  value: string
}

export const getBalancesFromProviderUsingMulticall = async (
  walletAddress: string,
  tokens: Token[],
): Promise<TokenAmount[]> => {
  // Configuration
  const { chainId } = tokens[0]
  const config = {
    rpcUrl: getRpcUrl(chainId),
    multicallAddress: getMulticallAddresse(chainId),
    interval: 1000000000, // calling stop on the watcher does not actually close the websocket
  }

  if (!config.multicallAddress) {
    // Fallback if multicall is not available
    return getBalancesFromProvider(walletAddress, tokens)
  }

  const tokenAmounts = await new Promise<TokenAmount[]>((resolve) => {
    // Collect calls we want to make
    const calls: any = []
    tokens.forEach(async (token) => {
      if (token.id === constants.AddressZero) {
        calls.push({
          call: ['getEthBalance(address)(uint256)', walletAddress],
          returns: [
            [
              [token.id, token.chainId].join('-'),
              (val: BN) => new BigNumber(val.toString()).shiftedBy(-token.decimals).toFixed(),
            ],
          ],
        })
      } else {
        calls.push({
          target: token.id,
          call: ['balanceOf(address)(uint256)', walletAddress],
          returns: [
            [
              [token.id, token.name, token.key].join('-'),
              (val: BN) => new BigNumber(val.toString()).shiftedBy(-token.decimals).toFixed(),
            ],
          ],
        })
      }
    })

    const watcher = createWatcher(calls, config)

    // Success case
    watcher.batch().subscribe((updates: UpdateType[]) => {
      watcher.stop()

      const tokenAmounts: TokenAmount[] = updates.map(({ type, value }): TokenAmount => {
        const [tokenId, chainId] = type.split('-')
        const token = tokens.find(
          (token) => token.id === tokenId && token.chainId === parseInt(chainId),
        )

        return {
          ...token!,
          amount: value,
        }
      })
      resolve(tokenAmounts)
    })

    // Error case
    watcher.onError((error: Error) => {
      watcher.stop()
      // eslint-disable-next-line no-console
      console.warn('Watcher Error:', error, chainId, config)
      resolve([])
    })

    // Submit calls
    watcher.start()
  })

  return tokenAmounts
}

const getBalancesFromProvider = async (
  walletAddress: string,
  tokens: Token[],
): Promise<TokenAmount[]> => {
  const chainId = tokens[0].chainId
  const rpc = getRpcProvider(chainId)

  const tokenAmountPromises: Promise<TokenAmount>[] = tokens.map(
    async (token): Promise<TokenAmount> => {
      try {
        const amount = await getBalanceFromProvider(walletAddress, token.id, rpc)
        return {
          ...token,
          amount: (await amount).shiftedBy(-token.decimals).toString(),
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e)
        return {
          ...token,
          amount: new BigNumber(0).toString(),
        }
      }
    },
  )
  return Promise.all(tokenAmountPromises)
}

const getBalanceFromProvider = async (
  walletAddress: string,
  assetId: string,
  provider: FallbackProvider,
): Promise<BigNumber> => {
  let balance
  if (assetId === constants.AddressZero) {
    balance = await provider.getBalance(walletAddress)
  } else {
    const contract = new Contract(
      assetId,
      ['function balanceOf(address owner) view returns (uint256)'],
      provider,
    )
    balance = await contract.balanceOf(walletAddress)
  }
  return new BigNumber(balance.toString())
}

import { ChainId, ChainKey, CoinKey, findDefaultCoinOnChain } from '@lifinance/types'

import balances from '.'
import utils from './utils'

jest.mock('./utils')
const mockedUtils = utils as jest.Mocked<typeof utils>

const defaultWalletAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'

describe('balances', () => {
  describe('getTokenBalance', () => {
    it('should load a token', () => {
      mockedUtils.getBalances.mockReturnValue(Promise.resolve([]))
      const token = findDefaultCoinOnChain(CoinKey.WETH, ChainKey.ETH)
      balances.getTokenBalance(defaultWalletAddress, token)
      expect(mockedUtils.getBalances).toHaveBeenCalledTimes(1)
    })
  })

  describe('getTokenBalances', () => {
    it('should load mutliple token in one request', () => {
      mockedUtils.getBalances.mockReturnValue(Promise.resolve([]))
      const tokens = [
        findDefaultCoinOnChain(CoinKey.WETH, ChainKey.ETH),
        findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ETH),
      ]
      balances.getTokenBalances(defaultWalletAddress, tokens)
      expect(mockedUtils.getBalances).toHaveBeenCalledTimes(1)
    })

    it('should load tokens in one request per chain', () => {
      mockedUtils.getBalances.mockReturnValue(Promise.resolve([]))
      const tokens = [
        findDefaultCoinOnChain(CoinKey.WETH, ChainKey.ETH),
        findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL),
        findDefaultCoinOnChain(CoinKey.DAI, ChainKey.POL),
      ]
      balances.getTokenBalances(defaultWalletAddress, tokens)
      expect(mockedUtils.getBalances).toHaveBeenCalledTimes(2)
    })
  })

  describe('getTokenBalancesForChains', () => {
    it('should load tokens in one request per chain', () => {
      mockedUtils.getBalances.mockReturnValue(Promise.resolve([]))
      const tokensByChain = {
        [ChainId.ETH]: [findDefaultCoinOnChain(CoinKey.WETH, ChainKey.ETH)],
        [ChainId.POL]: [
          findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL),
          findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.POL),
        ],
      }
      balances.getTokenBalancesForChains(defaultWalletAddress, tokensByChain)
      expect(mockedUtils.getBalances).toHaveBeenCalledTimes(2)
    })
  })
})

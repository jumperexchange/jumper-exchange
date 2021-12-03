import { ChainKey, CoinKey, findDefaultCoinOnChain, Token } from '@lifinance/types'
import BigNumber from 'bignumber.js'

import utils from './utils'

const defaultWalletAddress = '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'

describe('balances utils', () => {
  describe('getBalances Integration Tests', () => {
    const loadAndCompareTokenAmounts = async (walletAddress: string, tokens: Token[]) => {
      const tokenBalances = await utils.getBalances(walletAddress, tokens)

      expect(tokenBalances.length).toEqual(tokens.length)

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        const tokenBalance = tokenBalances[i]

        // contain token properties
        expect(token.id).toEqual(tokenBalance.id)

        // set amount
        expect(tokenBalance.amount).toBeDefined()
        expect(new BigNumber(tokenBalance.amount).gte(0)).toBeTruthy()
      }
    }

    it('should work for ERC20 on POL', async () => {
      const walletAddress = defaultWalletAddress
      const tokens = [
        findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL),
        findDefaultCoinOnChain(CoinKey.USDT, ChainKey.POL),
      ]

      await loadAndCompareTokenAmounts(walletAddress, tokens)
    })

    it('should work for MATIC on POL', async () => {
      const walletAddress = defaultWalletAddress
      const tokens = [
        findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.POL),
        findDefaultCoinOnChain(CoinKey.DAI, ChainKey.POL),
      ]

      await loadAndCompareTokenAmounts(walletAddress, tokens)
    })

    it('should return empty array for invalid data on POL', async () => {
      const walletAddress = defaultWalletAddress
      const invalidToken = findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.POL)
      invalidToken.id = '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
      const tokens = [findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL), invalidToken]

      const tokenBalances = await utils.getBalances(walletAddress, tokens)
      expect(tokenBalances.length).toBe(0)
    })

    it('should fallback to a direct call if only one token is requested', async () => {
      const walletAddress = defaultWalletAddress
      const tokens = [findDefaultCoinOnChain(CoinKey.DAI, ChainKey.BSC)]
      await loadAndCompareTokenAmounts(walletAddress, tokens)
    })

    it('should fallback to multiple calls if multicall in not available', async () => {
      const walletAddress = defaultWalletAddress
      const tokens = [
        findDefaultCoinOnChain(CoinKey.ETH, ChainKey.OPT),
        findDefaultCoinOnChain(CoinKey.USDC, ChainKey.OPT),
      ]
      await loadAndCompareTokenAmounts(walletAddress, tokens)
    })
  })
})

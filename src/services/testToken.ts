/* eslint-disable no-console */
import { FallbackProvider, JsonRpcSigner } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { constants, Contract, providers, utils } from 'ethers'

import { getRpcProviders } from '../components/web3/connectors'
import {
  ChainId,
  chainKeysToObject,
  CoinKey,
  defaultTokens,
  getChainById,
  TokenAmount,
  TokenWithAmounts,
} from '../types'

const testTokenAddresses: Record<number, string> = {
  // 3 - Ropsten
  [ChainId.ROP]: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
  // 4 - Rinkeby
  [ChainId.RIN]: '0x9ac2c46d7acc21c881154d57c0dc1c55a3139198',
  // 5 - Goerli
  [ChainId.GOR]: '0x8a1cad3703e0beae0e0237369b4fcd04228d1682',
  // 80001 - Mumbai Polygon Testnet
  [ChainId.MUM]: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
  // 421611 - Arbitrum Testnet
  [ChainId.ARBT]: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
  // 69 - Optimistic Ethereum (Kovan)
  // [ChainId.OPTT]: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
  // 97 - Binance Smart Chain Testnet
  [ChainId.BSCT]: '0xd86bcb7d85163fbc81756bb9cc22225d6abccadb',
}

const testChains = [
  ChainId.ROP,
  ChainId.RIN,
  ChainId.GOR,
  ChainId.KOV,
  ChainId.MUM,
  ChainId.ARBT,
  ChainId.OPTT,
  ChainId.BSCT,
  ChainId.ONET,

  // quickfix
  ChainId.ONE,
]

const chainProviders: Record<number, providers.FallbackProvider> = getRpcProviders(testChains)

export const testToken: { [ChainKey: string]: Array<TokenWithAmounts> } = {}
Object.entries(testTokenAddresses).forEach(([key, tokenAddress]) => {
  const chainId = parseInt(key)
  const chain = getChainById(chainId)
  testToken[chain.key] = [
    {
      address: tokenAddress,
      symbol: CoinKey.TEST,
      decimals: 18,
      chainId,
      coinKey: CoinKey.TEST,
      name: CoinKey.TEST,
      logoURI: '',
    },
  ]
})

const TestTokenABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (boolean)',
  'function mint(address account, uint256 amount)',
]

export const mintTokens = async (
  signer: JsonRpcSigner,
  assetId: string,
): Promise<providers.TransactionResponse> => {
  const signerAddress = await signer.getAddress()
  const contract = new Contract(assetId, TestTokenABI, signer)
  const response = await contract.mint(signerAddress, utils.parseEther('1000'))
  return response
}

export const getBalance = async (
  address: string,
  assetId: string,
  provider: providers.Provider | FallbackProvider,
): Promise<BigNumber> => {
  let balance
  if (assetId === constants.AddressZero) {
    balance = await provider.getBalance(address)
  } else {
    const contract = new Contract(assetId, TestTokenABI, provider)
    balance = await contract.balanceOf(address)
  }
  return new BigNumber(balance.toString())
}

export const getBalancesForWallet = async (address: string) => {
  const portfolio: { [ChainKey: string]: Array<TokenAmount> } = {}
  const promises: Array<Promise<any>> = []

  Object.entries(testToken).forEach(async ([chainKey, token]) => {
    const ethAmount = getBalance(
      address,
      constants.AddressZero,
      chainProviders[token[0].chainId],
    ).catch((e) => {
      console.warn(e)
      return new BigNumber(0)
    })
    const testAmount = getBalance(
      address,
      token[0].address,
      chainProviders[token[0].chainId],
    ).catch((e) => {
      console.warn(e)
      return new BigNumber(0)
    })
    promises.push(ethAmount)
    promises.push(testAmount)

    portfolio[chainKey] = [
      // native token
      {
        address: constants.AddressZero,
        name: 'ETH',
        symbol: 'ETH',
        coinKey: 'ETH' as CoinKey,
        chainId: token[0].chainId,
        decimals: token[0].decimals,
        logoURI: '',
        amount: (await ethAmount).shiftedBy(-18).toString(),
        priceUSD: new BigNumber(0).toString(),
      },
      // test token
      {
        address: token[0].address,
        name: token[0].name,
        symbol: token[0].symbol,
        coinKey: 'ETH' as CoinKey,
        chainId: token[0].chainId,
        decimals: token[0].decimals,
        logoURI: '',
        amount: (await testAmount).shiftedBy(-18).toString(),
        priceUSD: new BigNumber(0).toString(),
      },
    ]
  })

  await Promise.all(promises)

  return portfolio
}

export const getDefaultTokenBalancesForWallet = async (
  address: string,
  onChains?: Array<number>,
) => {
  const portfolio: { [ChainKey: string]: Array<TokenAmount> } = chainKeysToObject([])
  const promises: Array<Promise<any>> = []

  Object.entries(defaultTokens).forEach(async ([chainKey, tokens]) => {
    if (onChains && onChains.indexOf(tokens[0].chainId) === -1) {
      return
    }

    tokens.forEach(async (token) => {
      const amount = getBalance(address, token.address, chainProviders[token.chainId]).catch(
        (e) => {
          console.warn(e)
          return new BigNumber(0)
        },
      )
      promises.push(amount)
      portfolio[chainKey].push({
        ...token,
        amount: (await amount).shiftedBy(-token.decimals).toString(),
      })
    })
  })

  await Promise.all(promises)

  return portfolio
}

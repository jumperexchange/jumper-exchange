import { FallbackProvider } from '@ethersproject/providers'
import { BigNumber, constants, Contract, providers, Signer, utils } from "ethers"
import { getRpcProviders } from '../components/web3/connectors'
import { ChainId, chainKeysToObject, ChainPortfolio, CoinKey, defaultTokens, getChainById, TokenWithAmounts } from '../types'

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
  testToken[chain.key] = [{
    id: tokenAddress,
    symbol: CoinKey.TEST,
    decimals: 18,
    chainId: chainId,
    chainKey: chain.key,
    key: CoinKey.TEST,
    name: CoinKey.TEST,
    logoURI: '',
  }]
})

const TestTokenABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (boolean)",
  "function mint(address account, uint256 amount)",
]

export const mintTokens = async (signer: Signer, assetId: string): Promise<providers.TransactionResponse> => {
  const signerAddress = await signer.getAddress()
  const contract = new Contract(assetId, TestTokenABI, signer)
  const response = await contract.mint(signerAddress, utils.parseEther("1000"))
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
  return balance
}

export const getBalancesForWallet = async (address: string) => {
  const portfolio: { [ChainKey: string]: Array<ChainPortfolio> } = {}
  const promises: Array<Promise<any>> = []

  Object.entries(testToken).forEach(async ([chainKey, token]) => {
    const ethAmount = getBalance(address, constants.AddressZero, chainProviders[token[0].chainId]).catch((e) => { console.warn(e); return BigNumber.from(0) })
    const testAmount = getBalance(address, token[0].id, chainProviders[token[0].chainId]).catch((e) => { console.warn(e); return BigNumber.from(0) })
    promises.push(ethAmount)
    promises.push(testAmount)

    portfolio[token[0].chainKey] = [
      // native token
      {
        id: constants.AddressZero,
        name: 'ETH',
        symbol: 'ETH',
        img_url: '',
        amount: (await ethAmount).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
        pricePerCoin: 0,
        verified: false,
      },
      // test token
      {
        id: token[0].id,
        name: token[0].name,
        symbol: token[0].symbol,
        img_url: '',
        amount: (await testAmount).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
        pricePerCoin: 0,
        verified: false,
      },
    ]
  })

  await Promise.all(promises)

  return portfolio
}

export const getDefaultTokenBalancesForWallet = async (address: string, onChains?: Array<number>) => {
  const portfolio: { [ChainKey: string]: Array<ChainPortfolio> } = chainKeysToObject([])
  const promises: Array<Promise<any>> = []

  Object.entries(defaultTokens).forEach(async ([chainKey, tokens]) => {
    if (onChains && onChains.indexOf(tokens[0].chainId) === -1) {
      return
    }

    tokens.forEach(async (token) => {
      const amount = getBalance(address, token.id, chainProviders[token.chainId]).catch((e) => { console.warn(e); return BigNumber.from(0) })
      promises.push(amount)
      portfolio[chainKey].push({
        id: token.id,
        name: token.name,
        symbol: token.key,
        img_url: '',
        amount: (await amount).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
        pricePerCoin: 0,
        verified: false,
      })
    })
  })

  await Promise.all(promises)

  return portfolio
}

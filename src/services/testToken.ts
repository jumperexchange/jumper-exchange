import { FallbackProvider } from '@ethersproject/providers'
import { BigNumber, constants, Contract, providers, Signer, utils } from "ethers"
import { getRpcProviders } from '../components/web3/connectors'
import { ChainPortfolio, CoinKey, TokenWithAmounts } from '../types'
import { getChainById } from '../types/lists'

const testTokenAddresses: Record<number, string> = {
  // 4 - Rinkeby
  4: '0x9ac2c46d7acc21c881154d57c0dc1c55a3139198',
  // 5 - Goerli
  5: '0x8a1cad3703e0beae0e0237369b4fcd04228d1682',
  // 80001 - Mumbai Polygon Testnet
  80001: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
  // 421611 - Arbitrum Testnet
  421611: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
  // 69 - Optimistic Ethereum (Kovan)
  69: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
}

const testChains = [4, 5, 80001, 421611, 69]

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
      },
      // test token
      {
        id: token[0].id,
        name: token[0].name,
        symbol: token[0].symbol,
        img_url: '',
        amount: (await testAmount).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
        pricePerCoin: 0,
      },
    ]
  })

  await Promise.all(promises)

  return portfolio
}

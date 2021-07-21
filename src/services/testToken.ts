import { BigNumber, constants, Contract, providers, Signer, utils } from "ethers"
import { ChainKey, CoinKey, TokenWithAmounts } from '../types'

const rinkebyTestToken = {
  id: '0x9ac2c46d7acc21c881154d57c0dc1c55a3139198',
  symbol: CoinKey.TEST,
  decimals: 18,
  chainId: 4,
  chainKey: ChainKey.RIN,
  key: CoinKey.TEST,
  name: CoinKey.TEST,
  logoURI: '',
}
const goerliTestToken = {
  id: '0x8a1cad3703e0beae0e0237369b4fcd04228d1682',
  symbol: CoinKey.TEST,
  decimals: 18,
  chainId: 5,
  chainKey: ChainKey.GOR,
  key: CoinKey.TEST,
  name: CoinKey.TEST,
  logoURI: '',
}

export const testToken: { [ChainKey: string]: Array<TokenWithAmounts> } = {
  [ChainKey.RIN]: [
    rinkebyTestToken,
  ],
  [ChainKey.GOR]: [
    goerliTestToken,
  ],
}

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
  provider: providers.Provider,
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
  const providerRIN = new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_RINKEBY)
  const providerGOR = new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_GORLI)

  const pBalenceEthRin = getBalance(
    address,
    constants.AddressZero,
    providerRIN,
  )
  const pBalenceTestRin = getBalance(
    address,
    testToken[ChainKey.RIN][0].id,
    providerRIN,
  )
  const pBalenceEthGor = getBalance(
    address,
    constants.AddressZero,
    providerGOR,
  )
  const pBalenceTestGor = getBalance(
    address,
    testToken[ChainKey.GOR][0].id,
    providerGOR,
  )

  const portfolio = {
    [ChainKey.RIN]: [
      {
        id: '0x0000000000000000000000000000000000000000',
        name: 'ETH',
        symbol: 'ETH',
        img_url: '',
        amount: (await pBalenceEthRin).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
        pricePerCoin: 0,
      },
      {
        id: rinkebyTestToken.id,
        name: rinkebyTestToken.name,
        symbol: rinkebyTestToken.symbol,
        img_url: '',
        amount: (await pBalenceTestRin).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
        pricePerCoin: 0,
      },
    ],
    [ChainKey.GOR]: [
      {
        id: '0x0000000000000000000000000000000000000000',
        name: 'ETH',
        symbol: 'ETH',
        img_url: '',
        amount: (await pBalenceEthGor).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
        pricePerCoin: 0,
      },
      {
        id: goerliTestToken.id,
        name: goerliTestToken.name,
        symbol: goerliTestToken.symbol,
        img_url: '',
        amount: (await pBalenceTestGor).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
        pricePerCoin: 0,
      },
    ],
  }
  return portfolio
}

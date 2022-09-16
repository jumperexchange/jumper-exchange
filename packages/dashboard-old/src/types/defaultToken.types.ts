import { ChainId, ChainKey, CoinKey, findDefaultToken, Token } from '@lifi/sdk'

export const defaultTokens: { [ChainKey: string]: Array<Token> } = {
  [ChainKey.ETH]: [
    findDefaultToken(CoinKey.ETH, ChainId.ETH),
    findDefaultToken(CoinKey.USDC, ChainId.ETH),
    findDefaultToken(CoinKey.USDT, ChainId.ETH),
    findDefaultToken(CoinKey.MATIC, ChainId.ETH),
    findDefaultToken(CoinKey.WBTC, ChainId.ETH),

    // Partners
    // > MAGIC: https://etherscan.io/token/0xb0c7a3ba49c7a6eaba6cd4a96c55a1391070ac9a
    {
      address: '0xb0c7a3ba49c7a6eaba6cd4a96c55a1391070ac9a',
      chainId: ChainId.ETH,
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/arbitrum/assets/0x539bdE0d7Dbd336b79148AA742883198BBF60342/logo.png',
      name: 'MAGIC',
      symbol: 'MAGIC',
    },

    // ADDED TOKEN FOR MARKETING PURPOSES
    // > LOOKS: https://etherscan.io/token/0xf4d2888d29D722226FafA5d9B24F9164c092421E
    {
      address: '0xf4d2888d29D722226FafA5d9B24F9164c092421E',
      chainId: ChainId.ETH,
      decimals: 18,
      logoURI: 'https://etherscan.io/token/images/looksrare_32.png',
      name: 'LooksRare',
      symbol: 'LOOKS',
    },

    // > METIS: https://etherscan.io/token/0x9e32b13ce7f2e80a01932b42553652e053d6ed8e
    {
      address: '0x9e32b13ce7f2e80a01932b42553652e053d6ed8e',
      chainId: ChainId.ETH,
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/15595/small/metis.PNG',
      name: 'Metis Token',
      symbol: 'Metis',
    },
  ],
  [ChainKey.BSC]: [
    findDefaultToken(CoinKey.BNB, ChainId.BSC),
    findDefaultToken(CoinKey.USDC, ChainId.BSC),
    findDefaultToken(CoinKey.USDT, ChainId.BSC),
    findDefaultToken(CoinKey.DAI, ChainId.BSC),
    // findDefaultToken(CoinKey.WBTC, ChainId.BSC),

    // Partners
    // > METIS: https://bscscan.com/token/0xe552fb52a4f19e44ef5a967632dbc320b0820639
    {
      address: '0xe552fb52a4f19e44ef5a967632dbc320b0820639',
      chainId: ChainId.BSC,
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/15595/small/metis.PNG',
      name: 'Metis Token',
      symbol: 'Metis',
    },

    // ADDED TOKEN FOR MARKETING PURPOSES
    // > BOLE: https://bscscan.com/token/0x3375AfA606F5836154C95F1Df5830EA2e4F41DF2
    {
      address: '0x3375AfA606F5836154C95F1Df5830EA2e4F41DF2',
      chainId: ChainId.BSC,
      decimals: 18,
      logoURI: 'https://bscscan.com/token/images/boleinc_32.png',
      name: 'BoleToken',
      symbol: 'BOLE',
    },

    // ADDED TOKEN FOR MARKETING PURPOSES
    // > Dinoland Metaverse: https://bscscan.com/token/0x6B9481FB5465ef9Ab9347b332058D894aB09B2f6
    {
      address: '0x6B9481FB5465ef9Ab9347b332058D894aB09B2f6',
      chainId: ChainId.BSC,
      decimals: 18,
      logoURI: 'https://bscscan.com/token/images/dinoland_32.png',
      name: 'Dinoland Metaverse',
      symbol: 'DNL',
    },
  ],
  [ChainKey.POL]: [
    findDefaultToken(CoinKey.MATIC, ChainId.POL),
    findDefaultToken(CoinKey.USDC, ChainId.POL),
    findDefaultToken(CoinKey.USDT, ChainId.POL),
    findDefaultToken(CoinKey.DAI, ChainId.POL),
    findDefaultToken(CoinKey.WBTC, ChainId.POL),

    // Partners
    // > MIVA:
    {
      name: 'Minerva Wallet SuperToken',
      symbol: 'MIVA',
      coinKey: 'MIVA' as CoinKey,
      decimals: 18,
      chainId: ChainId.POL,
      logoURI: 'https://minerva.digital/i/MIVA-Token_200x200.png',
      address: '0xc0b2983a17573660053beeed6fdb1053107cf387',
    },
    {
      name: 'Own a fraction',
      symbol: 'FRACTION',
      coinKey: 'FRACTION' as CoinKey,
      decimals: 18,
      chainId: ChainId.POL,
      logoURI: 'https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519',
      address: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4',
    },
    // RAIDER
    {
      name: 'Crypto Raiders',
      symbol: 'RAIDER',
      coinKey: 'RAIDER' as CoinKey,
      decimals: 18,
      chainId: ChainId.POL,
      logoURI: 'https://assets.coingecko.com/coins/images/17638/small/Ue3Hfh8.png?1630737936',
      address: '0xcd7361ac3307d1c5a46b63086a90742ff44c63b3',
    },
  ],
  [ChainKey.DAI]: [
    findDefaultToken(CoinKey.DAI, ChainId.DAI),
    findDefaultToken(CoinKey.USDC, ChainId.DAI),
    findDefaultToken(CoinKey.USDT, ChainId.DAI),
    findDefaultToken(CoinKey.MATIC, ChainId.DAI),
    findDefaultToken(CoinKey.WBTC, ChainId.DAI),

    // Partners
    // > MIVA:
    {
      name: 'Minerva Wallet SuperToken',
      symbol: 'MIVA',
      coinKey: 'MIVA' as CoinKey,
      decimals: 18,
      chainId: ChainId.DAI,
      logoURI: 'https://minerva.digital/i/MIVA-Token_200x200.png',
      address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51',
    },
    {
      name: 'Own a fraction',
      symbol: 'FRACTION',
      coinKey: 'FRACTION' as CoinKey,
      decimals: 18,
      chainId: ChainId.DAI,
      logoURI: 'https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519',
      address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61',
    },
  ],
  [ChainKey.FTM]: [
    findDefaultToken(CoinKey.FTM, ChainId.FTM),
    findDefaultToken(CoinKey.USDC, ChainId.FTM),
    findDefaultToken(CoinKey.USDT, ChainId.FTM),
    findDefaultToken(CoinKey.DAI, ChainId.FTM),
    findDefaultToken(CoinKey.WBTC, ChainId.FTM),

    //For marketing 0xDAO token
    {
      address: '0xc165d941481e68696f43ee6e99bfb2b23e0e3114',
      chainId: ChainId.FTM,
      decimals: 18,
      logoURI:
        ' https://assets.coingecko.com/coins/images/22888/small/rjks-OoT_400x400.jpg?1642827011 ',
      name: '0xDAO',
      symbol: 'OXD',
    },

    // Partners - for marketing purposes
    // > TOMB: https://ftmscan.com/token/0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7
    {
      address: '0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7',
      chainId: ChainId.FTM,
      decimals: 18,
      logoURI: 'https://ftmscan.com/token/images/tomb_32.png',
      name: 'TOMB',
      symbol: 'TOMB',
    },
  ],
  [ChainKey.ARB]: [
    findDefaultToken(CoinKey.ETH, ChainId.ARB),
    findDefaultToken(CoinKey.USDC, ChainId.ARB),
    findDefaultToken(CoinKey.USDT, ChainId.ARB),
    findDefaultToken(CoinKey.DAI, ChainId.ARB),
    findDefaultToken(CoinKey.WBTC, ChainId.ARB),

    // Partners
    // > MAGIC
    {
      address: '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
      chainId: ChainId.ARB,
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/arbitrum/assets/0x539bdE0d7Dbd336b79148AA742883198BBF60342/logo.png',
      name: 'MAGIC',
      symbol: 'MAGIC',
    },
  ],
  [ChainKey.OPT]: [
    findDefaultToken(CoinKey.ETH, ChainId.OPT),
    findDefaultToken(CoinKey.USDC, ChainId.OPT),
    findDefaultToken(CoinKey.USDT, ChainId.OPT),
    findDefaultToken(CoinKey.DAI, ChainId.OPT),
    findDefaultToken(CoinKey.WBTC, ChainId.OPT),
  ],
  [ChainKey.ONE]: [
    findDefaultToken(CoinKey.ONE, ChainId.ONE),
    findDefaultToken(CoinKey.BNB, ChainId.ONE),
    findDefaultToken(CoinKey.ETH, ChainId.ONE),
    findDefaultToken(CoinKey.WBTC, ChainId.ONE),
  ],
  [ChainKey.AVA]: [
    findDefaultToken(CoinKey.AVAX, ChainId.AVA),
    findDefaultToken(CoinKey.USDC, ChainId.AVA),
    findDefaultToken(CoinKey.USDT, ChainId.AVA),
    findDefaultToken(CoinKey.DAI, ChainId.AVA),
    findDefaultToken(CoinKey.WBTC, ChainId.AVA),

    // ADDED TOKEN FOR MARKETING PURPOSES
    // > Defrost Finance Token: https://snowtrace.io/token/0x47EB6F7525C1aA999FBC9ee92715F5231eB1241D
    {
      address: '0x47EB6F7525C1aA999FBC9ee92715F5231eB1241D',
      chainId: ChainId.AVA,
      decimals: 18,
      logoURI: 'https://snowtrace.io/token/images/defrostfinance_32.png',
      name: 'Defrost Finance Token',
      symbol: 'MELT',
    },
  ],
  [ChainKey.MOR]: [
    findDefaultToken(CoinKey.MOVR, ChainId.MOR),
    findDefaultToken(CoinKey.USDC, ChainId.MOR),
    findDefaultToken(CoinKey.USDT, ChainId.MOR),
    // findDefaultToken(CoinKey.WBTC, ChainId.MOR),
  ],
  [ChainKey.OKT]: [
    findDefaultToken(CoinKey.OKT, ChainId.OKT),
    findDefaultToken(CoinKey.USDC, ChainId.OKT),
    findDefaultToken(CoinKey.USDT, ChainId.OKT),
  ],
  [ChainKey.HEC]: [
    findDefaultToken(CoinKey.HT, ChainId.HEC),
    findDefaultToken(CoinKey.USDC, ChainId.HEC),
    findDefaultToken(CoinKey.USDT, ChainId.HEC),
  ],

  // Testnet
  [ChainKey.GOR]: [
    findDefaultToken(CoinKey.ETH, ChainId.GOR),
    findDefaultToken(CoinKey.TEST, ChainId.GOR),
    findDefaultToken(CoinKey.USDC, ChainId.GOR),
    // findDefaultToken(CoinKey.USDT, ChainId.GOR),
    findDefaultToken(CoinKey.DAI, ChainId.GOR),
  ],
  [ChainKey.RIN]: [
    findDefaultToken(CoinKey.ETH, ChainId.RIN),
    findDefaultToken(CoinKey.TEST, ChainId.RIN),
    findDefaultToken(CoinKey.USDC, ChainId.RIN),
    findDefaultToken(CoinKey.USDT, ChainId.RIN),
    findDefaultToken(CoinKey.DAI, ChainId.RIN),
  ],
  [ChainKey.ROP]: [
    findDefaultToken(CoinKey.ETH, ChainId.ROP),
    findDefaultToken(CoinKey.TEST, ChainId.ROP),
    findDefaultToken(CoinKey.USDC, ChainId.ROP),
    findDefaultToken(CoinKey.USDT, ChainId.ROP),
    findDefaultToken(CoinKey.DAI, ChainId.ROP),
  ],
  [ChainKey.KOV]: [findDefaultToken(CoinKey.ETH, ChainId.KOV)],
  [ChainKey.MUM]: [
    findDefaultToken(CoinKey.MATIC, ChainId.MUM),
    findDefaultToken(CoinKey.TEST, ChainId.MUM),
    findDefaultToken(CoinKey.USDC, ChainId.MUM),
    // findDefaultToken(CoinKey.USDT, ChainId.MUM),
    findDefaultToken(CoinKey.DAI, ChainId.MUM),
  ],
  [ChainKey.BSCT]: [findDefaultToken(CoinKey.BNB, ChainId.BSCT)],
  [ChainKey.ONET]: [
    findDefaultToken(CoinKey.ONE, ChainId.ONET),
    findDefaultToken(CoinKey.ETH, ChainId.ONET),
    findDefaultToken(CoinKey.BNB, ChainId.ONET),
  ],
}

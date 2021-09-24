import { ChainId } from '..';
import { ChainKey, Coin, CoinKey, Token } from './base.types';

export const defaultCoins: Array<Coin> = [
  // NATIVE COINS
  // > ETH
  {
    key: CoinKey.ETH,
    name: CoinKey.ETH,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    verified: true,
    chains: {
      [ChainKey.ETH]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.ETH,
        chainKey: ChainKey.ETH,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.BSC]: {
        id: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.BSC,
        chainKey: ChainKey.BSC,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.POL]: {
        id: '0xfd8ee443ab7be5b1522a1c020c097cff1ddc1209',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.POL,
        chainKey: ChainKey.POL,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.DAI]: {
        id: '0xa5c7cb68cd81640d40c85b2e5ec9e4bb55be0214',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.DAI,
        chainKey: ChainKey.DAI,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.OPT]: { // guessed from debank api
        id: '0x4200000000000000000000000000000000000006',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.OPT,
        chainKey: ChainKey.OPT,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.OKT]: { // guessed from debank api
        id: '0xef71ca2ee68f45b9ad6f72fbdb33d707b872315c',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.OKT,
        chainKey: ChainKey.OKT,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      // [ChainKey.ARB]: { // WETH
      //   id: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      //   symbol: CoinKey.ETH,
      //   decimals: 18,
      //   chainId: ChainId.ARB,
      //   chainKey: ChainKey.ARB,
      //   key: CoinKey.ETH,
      //   name: CoinKey.ETH,
      //   logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      // },

      // Testnets
      [ChainKey.ROP]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.ROP,
        chainKey: ChainKey.ROP,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.RIN]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.RIN,
        chainKey: ChainKey.RIN,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.GOR]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: ChainId.GOR,
        chainKey: ChainKey.GOR,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
    },
  },
  // > MATIC
  {
    key: CoinKey.MATIC,
    name: CoinKey.MATIC,
    logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
    verified: true,
    chains: {
      [ChainKey.ETH]: {
        id: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        symbol: CoinKey.MATIC,
        decimals: 18,
        chainId: ChainId.ETH,
        chainKey: ChainKey.ETH,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },
      [ChainKey.BSC]: {
        id: '0xa90cb47c72f2c7e4411e781772735d9317d08dd4',
        symbol: CoinKey.MATIC,
        decimals: 8,
        chainId: ChainId.BSC,
        chainKey: ChainKey.BSC,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },
      [ChainKey.POL]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.MATIC,
        decimals: 18,
        chainId: ChainId.POL,
        chainKey: ChainKey.POL,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },
      [ChainKey.DAI]: {
        id: '0x7122d7661c4564b7c6cd4878b06766489a6028a2',
        symbol: CoinKey.MATIC,
        decimals: 18,
        chainId: ChainId.DAI,
        chainKey: ChainKey.DAI,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },

      // Testnet
      [ChainKey.MUM]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.MATIC,
        decimals: 18,
        chainId: ChainId.MUM,
        chainKey: ChainKey.MUM,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },
    },
  },
  // > BNB
  {
    key: CoinKey.BNB,
    name: CoinKey.BNB,
    logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
    verified: true,
    chains: {
      [ChainKey.ETH]: {
        id: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
        symbol: CoinKey.BNB,
        decimals: 18,
        chainId: ChainId.ETH,
        chainKey: ChainKey.ETH,
        key: CoinKey.BNB,
        name: CoinKey.BNB,
        logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
      },
      [ChainKey.BSC]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.BNB,
        decimals: 18,
        chainId: ChainId.BSC,
        chainKey: ChainKey.BSC,
        key: CoinKey.BNB,
        name: CoinKey.BNB,
        logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
      },
      [ChainKey.POL]: {
        id: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f',
        symbol: CoinKey.BNB,
        decimals: 18,
        chainId: ChainId.POL,
        chainKey: ChainKey.POL,
        key: CoinKey.BNB,
        name: CoinKey.BNB,
        logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
      },
      [ChainKey.DAI]: {
        id: '0xca8d20f3e0144a72c6b5d576e9bd3fd8557e2b04',
        symbol: CoinKey.BNB,
        decimals: 18,
        chainId: ChainId.DAI,
        chainKey: ChainKey.DAI,
        key: CoinKey.BNB,
        name: CoinKey.BNB,
        logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
      },
    },
  },
  // > DAI
  {
    key: CoinKey.DAI,
    name: CoinKey.DAI,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    verified: true,
    chains: {
      [ChainKey.ETH]: {
        id: '0x6b175474e89094c44da98b954eedeac495271d0f',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: ChainId.ETH,
        chainKey: ChainKey.ETH,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.BSC]: {
        id: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: ChainId.BSC,
        chainKey: ChainKey.BSC,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.POL]: {
        id: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: ChainId.POL,
        chainKey: ChainKey.POL,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.DAI]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: ChainId.DAI,
        chainKey: ChainKey.DAI,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.FTM]: {
        id: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
        symbol: CoinKey.DAI,
        decimals: 18, // TODO: check
        chainId: ChainId.DAI,
        chainKey: ChainKey.FTM,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },

      // Testnets
      [ChainKey.ROP]: {
        id: '0x31f42841c2db5173425b5223809cf3a38fede360', // on para 0xaD6D458402F60fD3Bd25163575031ACDce07538D, on faucet 0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: ChainId.ROP,
        chainKey: ChainKey.ROP,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.RIN]: {
        id: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: ChainId.RIN,
        chainKey: ChainKey.RIN,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.GOR]: {
        id: '0xc61ba16e864efbd06a9fe30aab39d18b8f63710a', // old: 0xdc31ee1784292379fbb2964b3b9c4124d8f89c60
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: ChainId.GOR,
        chainKey: ChainKey.GOR,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.MUM]: {
        id: '0xb224913CE3851b0a0d7C0FB461eEF40f2e31ddb8',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: ChainId.MUM,
        chainKey: ChainKey.MUM,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      // 42, 0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa, 18
    },
  },
  // > FTM
  {
    key: CoinKey.FTM,
    name: CoinKey.FTM,
    logoURI: 'https://assets.spookyswap.finance/tokens/FTM.png',
    verified: true,
    chains: {
      [ChainKey.FTM]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.FTM,
        decimals: 18, // check
        chainId: ChainId.FTM,
        chainKey: ChainKey.FTM,
        key: CoinKey.FTM,
        name: CoinKey.FTM,
        logoURI: 'https://assets.spookyswap.finance/tokens/FTM.png',
      },
    },
  },
  // > OKT
  {
    key: CoinKey.OKT,
    name: CoinKey.OKT,
    logoURI: '',
    verified: true,
    chains: {
      [ChainKey.OKT]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.OKT,
        decimals: 18, // check
        chainId: ChainId.OKT,
        chainKey: ChainKey.OKT,
        key: CoinKey.OKT,
        name: CoinKey.OKT,
        logoURI: '',
      },
    },
  },
  // > AVAX
  {
    key: CoinKey.AVAX,
    name: CoinKey.AVAX,
    logoURI: '',
    verified: true,
    chains: {
      [ChainKey.AVA]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.AVAX,
        decimals: 18, // check
        chainId: ChainId.AVA,
        chainKey: ChainKey.AVA,
        key: CoinKey.AVAX,
        name: CoinKey.AVAX,
        logoURI: '',
      },
    },
  },
  // > HT
  {
    key: CoinKey.HT,
    name: CoinKey.HT,
    logoURI: 'https://static.debank.com/image/heco_token/logo_url/heco/c399dcddde07e1944c4dd8f922832b53.png',
    verified: true,
    chains: {
      [ChainKey.HEC]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.HT,
        decimals: 18,
        chainId: ChainId.HEC,
        chainKey: ChainKey.HEC,
        key: CoinKey.HT,
        name: CoinKey.HT,
        logoURI: 'https://static.debank.com/image/heco_token/logo_url/heco/c399dcddde07e1944c4dd8f922832b53.png',
      },
    },
  },


  // OTHER STABLECOINS
  {
    key: CoinKey.USDT,
    name: CoinKey.USDT,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    verified: true,
    chains: {
      [ChainKey.ETH]: {
        id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: ChainId.ETH,
        chainKey: ChainKey.ETH,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.BSC]: {
        id: '0x55d398326f99059ff775485246999027b3197955',
        symbol: CoinKey.USDT,
        decimals: 18,
        chainId: ChainId.BSC,
        chainKey: ChainKey.BSC,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.POL]: {
        id: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: ChainId.POL,
        chainKey: ChainKey.POL,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.DAI]: {
        id: '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: ChainId.DAI,
        chainKey: ChainKey.DAI,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.FTM]: {
        id: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
        symbol: CoinKey.USDT,
        decimals: 6, // TODO: check
        chainId: ChainId.DAI,
        chainKey: ChainKey.FTM,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.ARB]: {
        id: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: ChainId.ARB,
        chainKey: ChainKey.ARB,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.OPT]: {
        id: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: ChainId.OPT,
        chainKey: ChainKey.OPT,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },

      // Testnets
      [ChainKey.ROP]: {
        id: '0x110a13fc3efe6a245b50102d2d79b3e76125ae83',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: ChainId.ROP,
        chainKey: ChainKey.ROP,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.RIN]: {
        id: '0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: ChainId.RIN,
        chainKey: ChainKey.RIN,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      // 42, 0x07de306ff27a2b630b1141956844eb1552b956b5, 6
    },
  },
  {
    key: CoinKey.USDC,
    name: CoinKey.USDC,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    verified: true,
    chains: {
      [ChainKey.ETH]: {
        id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.ETH,
        chainKey: ChainKey.ETH,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.BSC]: {
        id: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        symbol: CoinKey.USDC,
        decimals: 18,
        chainId: ChainId.BSC,
        chainKey: ChainKey.BSC,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.POL]: {
        id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.POL,
        chainKey: ChainKey.POL,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.DAI]: {
        id: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.DAI,
        chainKey: ChainKey.DAI,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.FTM]: {
        id: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
        symbol: CoinKey.USDC,
        decimals: 6, // Check
        chainId: 250,
        chainKey: ChainKey.FTM,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.ARB]: {
        id: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.ARB,
        chainKey: ChainKey.ARB,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.OPT]: {
        id: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.OPT,
        chainKey: ChainKey.OPT,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },

      // Testnets
      [ChainKey.ROP]: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.ROP,
        chainKey: ChainKey.ROP,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.RIN]: {
        id: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.RIN,
        chainKey: ChainKey.RIN,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.GOR]: {
        id: '0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.GOR,
        chainKey: ChainKey.GOR,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.MUM]: {
        id: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: ChainId.MUM,
        chainKey: ChainKey.MUM,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      // 42, 0xb7a4f3e9097c08da09517b5ab877f7a917224ede, 6
    },
  },

  // TEST COIN
  {
    key: CoinKey.TEST,
    name: CoinKey.TEST,
    logoURI: 'https://xpollinate.io/icon192.png',
    verified: false,
    chains: {
      [ChainKey.ROP]: {
        id: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
        symbol: CoinKey.TEST,
        decimals: 18,
        chainId: ChainId.ROP,
        chainKey: ChainKey.ROP,
        key: CoinKey.TEST,
        name: CoinKey.TEST,
        logoURI: 'https://xpollinate.io/icon192.png',
      },
      [ChainKey.RIN]: {
        id: '0x9ac2c46d7acc21c881154d57c0dc1c55a3139198',
        symbol: CoinKey.TEST,
        decimals: 18,
        chainId: ChainId.RIN,
        chainKey: ChainKey.RIN,
        key: CoinKey.TEST,
        name: CoinKey.TEST,
        logoURI: 'https://xpollinate.io/icon192.png',
      },
      [ChainKey.GOR]: {
        id: '0x8a1cad3703e0beae0e0237369b4fcd04228d1682',
        symbol: CoinKey.TEST,
        decimals: 18,
        chainId: ChainId.GOR,
        chainKey: ChainKey.GOR,
        key: CoinKey.TEST,
        name: CoinKey.TEST,
        logoURI: 'https://xpollinate.io/icon192.png',
      },
      [ChainKey.MUM]: {
        id: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
        symbol: CoinKey.TEST,
        decimals: 18,
        chainId: ChainId.MUM,
        chainKey: ChainKey.MUM,
        key: CoinKey.TEST,
        name: CoinKey.TEST,
        logoURI: 'https://xpollinate.io/icon192.png',
      },
      [ChainKey.ARBT]: {
        id: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
        symbol: CoinKey.TEST,
        decimals: 18,
        chainId: ChainId.ARBT,
        chainKey: ChainKey.ARBT,
        key: CoinKey.TEST,
        name: CoinKey.TEST,
        logoURI: 'https://xpollinate.io/icon192.png',
      },
      [ChainKey.BSCT]: {
        id: '0xd86bcb7d85163fbc81756bb9cc22225d6abccadb',
        symbol: CoinKey.TEST,
        decimals: 18,
        chainId: ChainId.BSCT,
        chainKey: ChainKey.BSCT,
        key: CoinKey.TEST,
        name: CoinKey.TEST,
        logoURI: 'https://xpollinate.io/icon192.png',
      },
      [ChainKey.OPTT]: {
        id: '0xe71678794fff8846bff855f716b0ce9d9a78e844',
        symbol: CoinKey.TEST,
        decimals: 18,
        chainId: ChainId.OPTT,
        chainKey: ChainKey.OPTT,
        key: CoinKey.TEST,
        name: CoinKey.TEST,
        logoURI: 'https://xpollinate.io/icon192.png',
      },
    },
  },

]

export const findDefaultCoin = (coinKey: CoinKey) => {
  const coin = defaultCoins.find(coin => coin.key === coinKey)
  if (!coin) {
    throw new Error('Invalid Coin')
  }
  return coin
}
export const findDefaultCoinOnChain = (coinKey: CoinKey, chainKey: ChainKey) => {
  const coin = findDefaultCoin(coinKey)
  const token = coin.chains[chainKey]
  return token
}

export const defaultTokens: { [ChainKey: string]: Array<Token> } = {
  [ChainKey.ETH]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.ETH),
  ],
  [ChainKey.BSC]: [
    findDefaultCoinOnChain(CoinKey.BNB, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.BSC),
  ],
  [ChainKey.POL]: [
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.POL),
  ],
  [ChainKey.DAI]: [
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.DAI),
  ],
  [ChainKey.FTM]: [
    findDefaultCoinOnChain(CoinKey.FTM, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.FTM),
  ],
  [ChainKey.ARB]: [
    // findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ARB),
  ],
  [ChainKey.OPT]: [
    // findDefaultCoinOnChain(CoinKey.ETH, ChainKey.OPT),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.OPT),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.OPT),
  ],

  // Testnet
  [ChainKey.GOR]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.GOR),
    // findDefaultCoinOnChain(CoinKey.USDT, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.GOR),
  ],
  [ChainKey.RIN]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.RIN),
  ],
  [ChainKey.ROP]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.ROP),
  ],
  [ChainKey.MUM]: [
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.MUM),
    // findDefaultCoinOnChain(CoinKey.USDT, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.MUM),
  ],
}

export const wrappedTokens: { [ChainKey: string]: Token } = {
  [ChainKey.ETH]: {
    // https://ww7.etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    symbol: 'WETH',
    decimals: 18,
    chainId: ChainId.ETH,
    chainKey: ChainKey.ETH,
    key: 'WETH' as CoinKey,
    name: 'WETH',
    logoURI: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.BSC]: {
    // https://bscscan.com/token/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c
    id: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    symbol: 'WBNB',
    decimals: 18,
    chainId: ChainId.BSC,
    chainKey: ChainKey.BSC,
    key: 'WBNB' as CoinKey,
    name: 'WBNB',
    logoURI: 'https://zapper.fi/images/networks/binance-smart-chain/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.POL]: {
    // https://polygonscan.com/token/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270
    id: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    symbol: 'WMATIC',
    decimals: 18,
    chainId: ChainId.POL,
    chainKey: ChainKey.POL,
    key: 'WMATIC' as CoinKey,
    name: 'WMATIC',
    logoURI: 'https://zapper.fi/images/networks/polygon/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.DAI]: {
    // https://blockscout.com/xdai/mainnet/address/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d
    id: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    symbol: 'WXDAI',
    decimals: 18,
    chainId: ChainId.DAI,
    chainKey: ChainKey.DAI,
    key: 'WXDAI' as CoinKey,
    name: 'WXDAI',
    logoURI: 'https://zapper.fi/images/networks/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  },
  [ChainKey.FTM]: {
    //
    id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    symbol: 'wFTM',
    decimals: 18,
    chainId: ChainId.FTM,
    chainKey: ChainKey.FTM,
    key: 'wFTM' as CoinKey,
    name: 'wFTM',
    logoURI: 'https://assets.spookyswap.finance/coins/0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83.png',
  },

  // Testnets
  [ChainKey.ROP]: {
    // https://ropsten.etherscan.io/token/0xc778417e063141139fce010982780140aa0cd5ab
    id: '0xc778417e063141139fce010982780140aa0cd5ab',
    symbol: 'WETH',
    decimals: 18,
    chainId: ChainId.ROP,
    chainKey: ChainKey.ROP,
    key: 'WETH' as CoinKey,
    name: 'WETH',
    logoURI: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.RIN]: {
    // https://rinkeby.etherscan.io/token/0xc778417e063141139fce010982780140aa0cd5ab
    id: '0xc778417e063141139fce010982780140aa0cd5ab',
    symbol: 'WETH',
    decimals: 18,
    chainId: ChainId.RIN,
    chainKey: ChainKey.RIN,
    key: 'WETH' as CoinKey,
    name: 'WETH',
    logoURI: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.GOR]: {
    // https://goerli.etherscan.io/token/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6
    id: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    symbol: 'WETH',
    decimals: 18,
    chainId: ChainId.GOR,
    chainKey: ChainKey.GOR,
    key: 'WETH' as CoinKey,
    name: 'WETH',
    logoURI: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.MUM]: {
    // https://mumbai.polygonscan.com/token/0x9c3c9283d3e44854697cd22d3faa240cfb032889
    id: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
    symbol: 'WMATIC',
    decimals: 18,
    chainId: ChainId.MUM,
    chainKey: ChainKey.MUM,
    key: 'WMATIC' as CoinKey,
    name: 'WMATIC',
    logoURI: 'https://zapper.fi/images/networks/polygon/0x0000000000000000000000000000000000000000.png',
  },
}


// adapted from https://github.com/1Hive/honeyswap-interface/blob/b25a3cbdec5f43613b1b282ef620f8fad891c82f/src/constants/index.ts
// https://github.com/pancakeswap/pancake-frontend/blob/a3ff0beeb57a39d7de6c4d7fa0de0e639921eb0c/src/config/constants/index.ts
// https://github.com/Uniswap/uniswap-interface/blob/b14da2844d3d0ff7d9b6a099499b9402db52629c/src/constants/routing.ts
//
export const BASES_TO_CHECK_TRADES_AGAINST = {
  [ChainKey.ETH]: [
    wrappedTokens[ChainKey.ETH],
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ETH),
    {
      id: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      decimals: 18,
      chainId: ChainId.DAI,
      chainKey: ChainKey.DAI
    } as Token,
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ETH)
  ],
  [ChainKey.DAI]: [
    wrappedTokens[ChainKey.DAI],
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.DAI),
    {
      id: '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252',
      symbol: 'WBTC',
      decimals: 18,
      chainId: ChainId.DAI,
      chainKey: ChainKey.DAI
    } as Token,
    {
      id: '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9',
      symbol: 'HNY',
      decimals: 18,
      chainId: ChainId.DAI,
      chainKey: ChainKey.DAI
    } as Token,
    {
      id: '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e',
      symbol: 'STAKE',
      decimals: 18,
      chainId: ChainId.DAI,
      chainKey: ChainKey.DAI
    } as Token,
    {
      id: '0x3a97704a1b25F08aa230ae53B352e2e72ef52843',
      symbol: 'AGVE',
      decimals: 18,
      chainId: ChainId.DAI,
      chainKey: ChainKey.DAI
    } as Token,
    {
      id: '0x82dFe19164729949fD66Da1a37BC70dD6c4746ce',
      symbol: 'BAO',
      decimals: 18,
      chainId: ChainId.DAI,
      chainKey: ChainKey.DAI
    } as Token,
  ],
  [ChainKey.POL]: [
    // WETH[ChainId.MATIC],
    wrappedTokens[ChainKey.POL],
    {
      id: '0xb371248dd0f9e4061ccf8850e9223ca48aa7ca4b',
      symbol: 'HNY',
      decimals: 18,
      chainId: ChainId.POL,
      chainKey: ChainKey.POL
    } as Token,
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.POL)
  ],
  [ChainKey.BSC]: [
    wrappedTokens[ChainKey.BSC],
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.BSC),
    {
      id: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      symbol: 'CAKE',
      decimals: 18,
      chainId: ChainId.BSC,
      chainKey: ChainKey.BSC
    } as Token,
    {
      id: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      symbol: 'BTCB',
      decimals: 18,
      chainId: ChainId.BSC,
      chainKey: ChainKey.BSC
    } as Token,
    {
      id: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      symbol: 'ETH',
      decimals: 18,
      chainId: ChainId.BSC,
      chainKey: ChainKey.BSC
    } as Token,
    {
      id: '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
      symbol: 'ETH',
      decimals: 18,
      chainId: ChainId.BSC,
      chainKey: ChainKey.BSC
    } as Token,
  ],
  [ChainKey.OKT]: [],
  [ChainKey.FTM]: [
    findDefaultCoinOnChain(CoinKey.FTM, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.FTM),
  ],
  [ChainKey.AVA]: [],
  [ChainKey.ARB]: [],
  [ChainKey.HEC]: [],
  [ChainKey.OPT]: [],

  // Testnets
  [ChainKey.ROP]: [
    wrappedTokens[ChainKey.ROP],
  ],
  [ChainKey.RIN]: [
    wrappedTokens[ChainKey.RIN],
  ],
  [ChainKey.GOR]: [
    wrappedTokens[ChainKey.GOR],
  ],
  [ChainKey.MUM]: [
    wrappedTokens[ChainKey.MUM],
  ],
  [ChainKey.ARBT]: [],
  [ChainKey.OPTT]: [],
  [ChainKey.BSCT]: [],
  [ChainKey.HECT]: [],
}

import {
  ChainType,
  createConfig,
  EVM,
  getChains,
  getTokenBalances,
  getTokens as LifiGetTokens,
  Solana,
} from '@lifi/sdk';
import { formatUnits } from 'viem';
import coins from './coins';
import type { ExtendedChain, TokenAmount } from '@lifi/types';

const tokensList = [
  {
    chainId: 1,
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'ETH',
    decimals: 18,
    priceUSD: '2468.28',
    coinKey: 'ETH',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    name: 'MAGIC',
    address: '0xb0c7a3ba49c7a6eaba6cd4a96c55a1391070ac9a',
    symbol: 'MAGIC',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/arbitrum/assets/0x539bdE0d7Dbd336b79148AA742883198BBF60342/logo.png',
  },
  {
    name: 'LooksRare',
    address: '0xf4d2888d29D722226FafA5d9B24F9164c092421E',
    symbol: 'LOOKS',
    decimals: 18,
    chainId: 1,
    logoURI: 'https://etherscan.io/token/images/looksrare_32.png',
  },
  {
    name: 'Metis Token',
    address: '0x9e32b13ce7f2e80a01932b42553652e053d6ed8e',
    symbol: 'Metis',
    decimals: 18,
    chainId: 1,
    logoURI: 'https://assets.coingecko.com/coins/images/15595/small/metis.PNG',
  },
  {
    name: 'X2Y2',
    address: '0x1E4EDE388cbc9F4b5c79681B7f94d36a11ABEBC9',
    symbol: 'X2Y2',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://assets.coingecko.com/coins/images/23633/small/logo-60b81ff87b40b11739105acf5ad1e075.png?1644903256',
  },
  {
    name: 'Cult DAO',
    address: '0xf0f9d895aca5c8678f706fb8216fa22957685a13',
    symbol: 'CULT',
    decimals: 18,
    chainId: 1,
    logoURI: 'https://etherscan.io/token/images/cultdao_32.png?=v1',
  },
  {
    name: 'Redacted Cartel',
    address: '0xc0d4ceb216b3ba9c3701b291766fdcba977cec3a',
    symbol: 'BTRFLY',
    decimals: 9,
    chainId: 1,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/16236.png',
  },
  {
    name: 'ApeCoin',
    address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
    symbol: 'APE',
    decimals: 18,
    chainId: 1,
    logoURI: 'https://etherscan.io/token/images/apecoin_32.png',
  },
  {
    name: 'Jigstack',
    address: '0x1F8A626883d7724DBd59eF51CBD4BF1Cf2016D13',
    symbol: 'STAK',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://assets.coingecko.com/coins/images/14978/small/jigstack.PNG?1619216498',
  },
  {
    name: 'BOB',
    address: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
    symbol: 'BOB',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://assets.coingecko.com/coins/images/27266/small/Bob-logo.png?1663073030',
  },
  {
    name: 'Transient',
    address: '0x805ea9c07b49dd23ce11ec66dc6d8a2957385035',
    symbol: 'TSCT',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://static.debank.com/image/bsc_token/logo_url/0xeeed90aa795c0e7d90fcec0fcfaa7bf6fc13c20a/ac8c76483ddc219334d49e5423a564a3.png',
  },
  {
    name: 'Poundtoken',
    address: '0x86b4dbe5d203e634a12364c0e428fa242a3fba98',
    symbol: 'GBPT',
    decimals: 18,
    chainId: 1,
    logoURI: 'https://etherscan.io/token/images/gbptoken_32.png',
  },
  {
    name: 'GoodDollar',
    address: '0x67c5870b4a41d4ebef24d2456547a03f1f3e094b',
    symbol: 'G$',
    decimals: 2,
    chainId: 1,
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x67c5870b4a41d4ebef24d2456547a03f1f3e094b/7db0aed77313b82cf929faf48b78aa59.png',
  },
  {
    name: 'MahaDAO',
    address: '0x745407c86df8db893011912d3ab28e68b62e49b0',
    symbol: 'MAHA',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x745407c86df8db893011912d3ab28e68b62e49b0/99948ee1cfc4ab1e5a88c50090e36206.png',
  },
  {
    name: 'AllianceBlock Nexera',
    address: '0x644192291cc835A93d6330b24EA5f5FEdD0eEF9e',
    symbol: 'NXRA',
    decimals: 18,
    chainId: 1,
    logoURI: 'https://i.imgur.com/voD8CiS.png',
  },
  {
    name: 'Relay Token',
    address: '0x5d843fa9495d23de997c394296ac7b4d721e841c',
    symbol: 'RELAY',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://assets.coingecko.com/coins/images/17816/small/relay-logo-200.png?1629339288',
  },
  {
    name: 'Brazilian Digital',
    address: '0x420412E765BFa6d85aaaC94b4f7b708C89be2e2B',
    symbol: 'BRZ',
    decimals: 4,
    chainId: 1,
    logoURI:
      'https://assets.coingecko.com/coins/images/8472/small/MicrosoftTeams-image_%286%29.png?1674480131',
  },
  {
    name: 'Monerium EUR emoney',
    address: '0x3231cb76718cdef2155fc47b5286d82e6eda273f',
    symbol: 'EURe',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://assets.coingecko.com/coins/images/23354/small/eur.png?1643926562',
  },
  {
    name: 'IPOR Token',
    address: '0x1e4746dC744503b53b4A082cB3607B169a289090',
    symbol: 'IPOR',
    decimals: 18,
    chainId: 1,
    logoURI: 'https://etherscan.io/token/images/ipor_32.png',
  },
  {
    name: 'SquidGrow',
    address: '0xd8Fa690304D2B2824D918C0c7376e2823704557A',
    symbol: 'SquidGrow',
    decimals: 9,
    chainId: 1,
    logoURI: 'https://etherscan.io/token/images/squidgrow_32.png',
  },
  {
    name: 'BetSwirl v2',
    address: '0x94025780a1ab58868d9b2dbbb775f44b32e8e6e5',
    symbol: 'BETS',
    decimals: 18,
    chainId: 1,
    logoURI: 'https://etherscan.io/token/images/betswirl_32.png',
  },
  {
    name: 'Wombat Token',
    address: '0xc0B314a8c08637685Fc3daFC477b92028c540CFB',
    symbol: 'WOM',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://assets.coingecko.com/coins/images/26946/small/Wombat_Token.png?1660982422',
  },
  {
    name: 'Verse',
    address: '0x249ca82617ec3dfb2589c4c17ab7ec9765350a18',
    symbol: 'VERSE',
    decimals: 18,
    chainId: 1,
    logoURI:
      'https://token-icons.s3.amazonaws.com/0x249ca82617ec3dfb2589c4c17ab7ec9765350a18.png',
  },
  {
    address: '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3',
    chainId: 1,
    symbol: 'MIM',
    decimals: 18,
    name: 'Magic Internet Money',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3/7d0c0fb6eab1b7a8a9bfb7dcc04cb11e.png',
  },
  {
    address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6',
    chainId: 1,
    symbol: 'STG',
    decimals: 18,
    name: 'StargateToken',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6/55886c6280173254776780fd8340cca7.png',
  },
  {
    address: '0x7DEdBce5a2E31E4c75f87FeA60bF796C17718715',
    chainId: 1,
    symbol: 'PNP',
    decimals: 18,
    name: 'Penpie Token',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x7dedbce5a2e31e4c75f87fea60bf796c17718715/1ecd5af28d9ef5188df40c96aad117b9.png',
  },
  {
    address: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
    chainId: 1,
    symbol: 'Cake',
    decimals: 18,
    name: 'PancakeSwap Token',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x152649ea73beab28c5b49b26eb48f7ead6d4c898/9003539eb61139bd494b7412b785d482.png',
  },
  {
    address: '0xa10bf0aBa0C7953F279c4Cb8192d3B5dE5eA56E8',
    chainId: 1,
    symbol: 'TAROT',
    decimals: 18,
    name: 'Tarot',
    logoURI: '',
  },
  {
    address: '0xc31C504d7Ef537CEE23a95B95045Ec28Aa632b32',
    chainId: 1,
    symbol: 'UXD',
    decimals: 18,
    name: 'UXD',
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/15028.png',
  },
  {
    address: '0xE60779CC1b2c1d0580611c526a8DF0E3f870EC48',
    chainId: 1,
    symbol: 'USH',
    decimals: 18,
    name: 'unshETHing_Token',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0xe60779cc1b2c1d0580611c526a8df0e3f870ec48/8a97ade0a9350165b645a05d1bd2b6f0.png',
  },
  {
    address: '0x2297aEbD383787A160DD0d9F71508148769342E3',
    chainId: 1,
    symbol: 'BTC.b',
    decimals: 8,
    name: 'Bitcoin',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x2297aebd383787a160dd0d9f71508148769342e3/302c75014907af482ed27e9d91e14b8b.png',
  },
  {
    address: '0x83e817E1574e2201a005EC0f7e700ED5606F555E',
    chainId: 1,
    symbol: 'mPendleOFT',
    decimals: 18,
    name: 'mPendleOFT',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x83e817e1574e2201a005ec0f7e700ed5606f555e/b1d3bfeae0c8d3677c5ae4f9278a610a.png',
  },
  {
    address: '0x31429d1856aD1377A8A0079410B297e1a9e214c2',
    chainId: 1,
    symbol: 'ANGLE',
    decimals: 18,
    name: 'ANGLE',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x31429d1856ad1377a8a0079410b297e1a9e214c2/950fda44a9f4598d2a7a6e9df24b7332.png',
  },
  {
    address: '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
    chainId: 1,
    symbol: 'EURA',
    decimals: 18,
    name: 'EURA (previously agEUR)',
    logoURI:
      'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/src/assets/tokens/EURA.svg',
  },
  {
    address: '0x004626A008B1aCdC4c74ab51644093b155e59A23',
    chainId: 1,
    logoURI:
      'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/src/assets/tokens/stEUR.svg',
    decimals: 18,
    name: 'Staked EURA',
    symbol: 'stEUR',
  },
  {
    address: '0x0000206329b97DB379d5E1Bf586BbDB969C63274',
    chainId: 1,
    symbol: 'USDA',
    decimals: 18,
    name: 'USDA',
    logoURI:
      'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/src/assets/tokens/USDA.svg',
  },
  {
    address: '0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776',
    chainId: 1,
    logoURI:
      'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/src/assets/tokens/stUSD.svg',
    decimals: 18,
    name: 'Staked USDA',
    symbol: 'stUSD',
  },
  {
    address: '0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5',
    chainId: 1,
    symbol: 'OHM',
    decimals: 9,
    name: 'Olympus',
    logoURI:
      'https://static.debank.com/image/eth_token/logo_url/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0ad387f86fba0c16654cfb0f720df5d6.png',
  },
  {
    address: '0x644192291cc835A93d6330b24EA5f5FEdD0eEF9e',
    chainId: 1,
    symbol: 'NXRA',
    decimals: 18,
    name: 'AllianceBlock Nexera Token',
    logoURI:
      'https://assets.coingecko.com/coins/images/29181/small/nxra.png?1696528139',
  },
  {
    address: '0x6c249b6F6492864d914361308601A7aBb32E68f8',
    chainId: 1,
    symbol: 'DUA',
    decimals: 18,
    name: 'DUA',
    logoURI:
      'https://assets.coingecko.com/coins/images/27976/small/Screenshot_2023-06-13_at_11.58.02_AM.png?1696526994',
  },
  {
    address: '0x19062190B1925b5b6689D7073fDfC8c2976EF8Cb',
    chainId: 1,
    symbol: 'BZZ',
    decimals: 16,
    name: 'Swarm',
    logoURI:
      'https://assets.coingecko.com/coins/images/16509/standard/Circle_Orange_onWhite.png?1696516071',
  },
  {
    address: '0xd9a442856c234a39a81a089c06451ebaa4306a72',
    chainId: 1,
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/35176/small/pufETH-200-200-resolution.png',
    name: 'pufETH',
    symbol: 'pufETH',
  },
  {
    address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
    chainId: 1,
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/33033/small/weETH.png',
    name: 'Wrapped eETH',
    symbol: 'weETH',
  },
  {
    address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
    chainId: 1,
    logoURI: 'https://strapi.li.finance/uploads/pepe_9f618b02d1.png',
    decimals: 18,
    name: 'Pepe',
    symbol: 'PEPE',
  },
];

interface Chain extends ExtendedChain, Price {}

interface Price {
  amount?: bigint;
  totalPriceUSD: number;
  formattedBalance: number;
}

export interface ExtendedTokenAmount extends TokenAmount, Partial<Price> {
  chains: Chain[];
}

function getBalance(tb: Partial<TokenAmount>) {
  return (
    (tb?.amount &&
      tb?.decimals &&
      Number(formatUnits(tb.amount, tb.decimals))) ||
    0
  );
}

function transform(
  tokenBalances: TokenAmount[],
  chains: ExtendedChain[],
): ExtendedTokenAmount[] {
  const tokenMap: Record<string, ExtendedTokenAmount> = {};

  tokenBalances.forEach((tb) => {
    if (tokenMap[tb.symbol]) {
      // Merge balances
      tokenMap[tb.symbol].amount =
        BigInt(tokenMap[tb.symbol].amount || 0) + BigInt(tb.amount || 0);
    } else {
      tokenMap[tb.symbol] = {
        ...tb,
        chains: [],
      };
    }

    const chain = chains.find((c) => c.id === tb.chainId);
    if (chain) {
      const balance = getBalance(tb);
      tokenMap[tb.symbol].chains?.push({
        ...chain,
        formattedBalance: balance,
        amount: tb.amount,
        totalPriceUSD: balance * Number(tb.priceUSD || 1) ?? 0,
      });
    }
  });

  let mergedTokenBalances = Object.values(tokenMap);

  mergedTokenBalances = mergedTokenBalances.map((tb) => {
    // const token = tb.token;
    const balance = getBalance(tb);

    return {
      ...tb,
      formattedBalance: balance,
      totalPriceUSD: balance * Number(tb.priceUSD || 1) ?? 0,
    };
  });

  return mergedTokenBalances.sort(
    (a, b) => (b.totalPriceUSD || 0) - (a.totalPriceUSD || 0),
  );
}

async function index(account: string) {
  try {
    createConfig({
      providers: [EVM(), Solana()],
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
      preloadChains: true,
    });

    // Can be server side call
    const chains = await getChains({
      chainTypes: [ChainType.EVM, ChainType.SVM],
    });

    const tokenBalances = await getTokenBalances(
      account,
      coins as TokenAmount[],
    );
    const transformedTokenBalances = transform(
      tokenBalances.filter((s) => s?.amount && s.amount > 0),
      chains,
    ).filter((tb) => Math.round(tb.totalPriceUSD || 0) > 0);

    return transformedTokenBalances;
  } catch (error) {
    console.error(error);
  }
}

export default index;

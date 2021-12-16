import { ChainKey } from '@lifinance/sdk'

import arb from '../assets/icons/arbitrum.svg'
import arbt from '../assets/icons/arbitrum_test.png'
import ava from '../assets/icons/avalanche.png'
import bsc from '../assets/icons/bsc.png'
import bsct from '../assets/icons/bsc_test.png'
import eth from '../assets/icons/ethereum.png'
import gor from '../assets/icons/ethereum_goerli.png'
import rin from '../assets/icons/ethereum_rinkeby.png'
import rop from '../assets/icons/ethereum_ropsten.png'
import ftm from '../assets/icons/fantom.png'
import one from '../assets/icons/harmony.png'
import onet from '../assets/icons/harmony_test.png'
import hec from '../assets/icons/heco.png'
import honey from '../assets/icons/honey.png'
import mor from '../assets/icons/moonriver.png'
import okt from '../assets/icons/okex.png'
import opt from '../assets/icons/optimism.png'
import pancake from '../assets/icons/pancake.png'
import pol from '../assets/icons/polygon.png'
import mum from '../assets/icons/polygon_test.png'
import quick from '../assets/icons/quick.png'
import spooky from '../assets/icons/spooky.png'
import sushi from '../assets/icons/sushi.png'
import uniswap from '../assets/icons/uniswap.png'
import viper from '../assets/icons/viper.png'
import dai from '../assets/icons/xdai.png'

export const icons: { [key: string]: string } = {
  // Mainnets
  [ChainKey.ETH]: eth,
  [ChainKey.POL]: pol,
  [ChainKey.BSC]: bsc,
  [ChainKey.DAI]: dai,
  [ChainKey.OKT]: okt,
  [ChainKey.FTM]: ftm,
  [ChainKey.AVA]: ava,
  [ChainKey.ARB]: arb,
  [ChainKey.HEC]: hec,
  [ChainKey.OPT]: opt,
  [ChainKey.ONE]: one,
  [ChainKey.MOR]: mor,

  // Testnets
  [ChainKey.ROP]: rop,
  [ChainKey.RIN]: rin,
  [ChainKey.GOR]: gor,
  [ChainKey.MUM]: mum,
  [ChainKey.ARBT]: arbt,
  //[ChainKey.OPTT]: optt,
  [ChainKey.BSCT]: bsct,
  //[ChainKey.HECT]: hect,
  [ChainKey.ONET]: onet,

  // Exchanges
  Pancakeswap: pancake,
  Quickswap: quick,
  Honeyswap: honey,
  Uniswap: uniswap,
  Spookyswap: spooky,
  Viperswap: viper,
  Sushiswap: sushi,
}
export const getIcon = (name: string | undefined) => {
  if (name && icons[name]) {
    return icons[name]
  }
  return undefined
}

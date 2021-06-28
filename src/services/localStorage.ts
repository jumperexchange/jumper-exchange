import { ChainKey, Wallet } from '../types';

const isSupported = () => {
  try {
    var itemBackup = localStorage.getItem("");
    localStorage.removeItem("");
    if (itemBackup === null)
      localStorage.removeItem("");
    else
      localStorage.setItem("", itemBackup);
    return true;
  }
  catch (e) {
    return false;
  }
}

const storeWallets = (wallets: Array<Wallet>) => {
  if (isSupported()) {
    localStorage.setItem('wallets', JSON.stringify(wallets.map(item => item.address)))
  }
}

const readWallets = (): Array<Wallet> => {
  if (!isSupported()) {
    return []
  }
  
  const walletsString = localStorage.getItem('wallets')
  if (walletsString) {
    try {
      const addresses = JSON.parse(walletsString)
      return addresses.map((address: string) => {
        return {
          address: address,
          loading: false,
          portfolio:{
            [ChainKey.ETH]:[],
            [ChainKey.BSC]:[],
            [ChainKey.POL]:[],
            [ChainKey.DAI]:[],
            [ChainKey.FTM]:[],
            [ChainKey.OKT]:[]
          }
        }
      })
    }
    catch (e) {
      return []
    }
  } else {
    return []
  }
}



export { isSupported, storeWallets, readWallets }

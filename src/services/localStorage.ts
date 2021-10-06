import { chainKeysToObject, TransferStep, Wallet } from '../types';

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

const clearLocalStorage = () => {
  if (isSupported()) {
    localStorage.clear()
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
          portfolio: chainKeysToObject([]),
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

const storeNxtpMessagingToken = (token: string, account: string) => {
  if (isSupported()) {
    localStorage.setItem('nxtpMessagingToken', token + ':' + account)
  }
}

const readNxtpMessagingToken = () => {
  if (!isSupported()) {
    return null
  }
  const value = localStorage.getItem('nxtpMessagingToken')
  if (!value) {
    return null
  }
  const parts = value.split(':')
  return {
    token: parts[0],
    account: parts.length > 1 && parts[1] ? parts[1] : null
  }
}

const storeHideAbout = (hide: boolean) => {
  if (isSupported()) {
    localStorage.setItem('nxtpHideDemo', hide ? 'true' : 'false')
  }
}

const readHideAbout = () => {
  if (!isSupported()) {
    return false
  }
  const value = localStorage.getItem('nxtpHideDemo')
  return value === 'true'
}


const storeActiveRoute = (route: TransferStep[]) => {
  if (!isSupported()) return
  // serialize all JSX elements correctly
  localStorage.setItem('activeRoute', JSON.stringify(route, (k, v) =>
    typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v,
  ))
}

const deleteActiveRoute = () => {
  if (!isSupported()) {
    return
  }
  localStorage.removeItem('activeRoute')
}

const readActiveRoute =(): TransferStep[] => {
  if (!isSupported()) {
    return [] as TransferStep[]
  }
  const routeString = localStorage.getItem('activeRoute')

  if (routeString) {
    try {
      // deserialize all JSX elements correctly
      const route = JSON.parse(routeString, (k, v) => {
        const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/);

        return matches ? Symbol.for(matches[1]) : v;
      })
      return route as TransferStep[]
    }
    catch (e) {
      return [] as TransferStep[]
    }
  } else {
    return [] as TransferStep[]
  }
}

export {
  isSupported,
  clearLocalStorage,
  storeWallets,
  readWallets,
  storeNxtpMessagingToken,
  readNxtpMessagingToken,
  storeHideAbout,
  readHideAbout,
  storeActiveRoute,
  deleteActiveRoute,
  readActiveRoute
}

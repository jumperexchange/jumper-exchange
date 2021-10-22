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
    return true
  }
  const value = localStorage.getItem('nxtpHideDemo')
  return !(value === 'false')
}


const storeActiveRoute = (route: TransferStep[]) => {
  if (!isSupported()) return
  const storedRoutes = readActiveRoutes()
  let updatedRoutes: TransferStep[][]
  if(!storedRoutes.length){
    updatedRoutes = [route]
  } else {
    let replaced = false
    updatedRoutes = storedRoutes.map((storedRoute, index) => {
      if(storedRoute[0].id === route[0].id){
        storedRoute = route
        replaced = true
      }
      return storedRoute
    })
    if(!replaced) {
      updatedRoutes.push(route)
    }
  }

  localStorage.setItem('activeRoute', JSON.stringify(updatedRoutes, (k, v) =>
    typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v,
  ))
}

const deleteRoute = (route: TransferStep[]) => {
  if (!isSupported() || !route) {
    return
  }
  const storedRoutes = readAllRoutes()
  const updatedRoutes = storedRoutes.filter((storedRoute) => storedRoute[0].id !== route[0].id)

  localStorage.setItem('activeRoute', JSON.stringify(updatedRoutes, (k, v) =>
    typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v,
  ))
}

const readAllRoutes = (): Array<TransferStep[]> =>{
  if (!isSupported()) {
    return [] as Array<TransferStep[]>
  }
  const routeString = localStorage.getItem('activeRoute')

  if (routeString) {
    try {
      const routes = JSON.parse(routeString, (k, v) => {
        const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/);

        return matches ? Symbol.for(matches[1]) : v;
      }) as Array<TransferStep[]>
      return routes as Array<TransferStep[]>
    }
    catch (e) {
      return [] as Array<TransferStep[]>
    }
  } else {
    return [] as Array<TransferStep[]>
  }
}

const readActiveRoutes = (): Array<TransferStep[]> => {
  if (!isSupported()) {
    return [] as Array<TransferStep[]>
  }
  const routeString = localStorage.getItem('activeRoute')

  if (routeString) {
    try {
      const routes = JSON.parse(routeString, (k, v) => {
        const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/);

        return matches ? Symbol.for(matches[1]) : v;
      }) as Array<TransferStep[]>
      const filteredRoutes = routes.filter(route => {
        const allDone = route.every(step => step.execution?.status === 'DONE')
        if(allDone){
          return null
        } else{
          return route
        }
      })
      return filteredRoutes as Array<TransferStep[]>
    }
    catch (e) {
      return [] as Array<TransferStep[]>
    }
  } else {
    return [] as Array<TransferStep[]>
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
  deleteRoute,
  readActiveRoutes
}

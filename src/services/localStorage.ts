import { chainKeysToObject, Route, Wallet } from '../types'

const isSupported = () => {
  try {
    var itemBackup = localStorage.getItem('')
    localStorage.removeItem('')
    if (itemBackup === null) localStorage.removeItem('')
    else localStorage.setItem('', itemBackup)
    return true
  } catch (e) {
    return false
  }
}

const clearLocalStorage = () => {
  if (isSupported()) {
    localStorage.clear()
  }
}

const storeWallets = (wallets: Array<Wallet>) => {
  if (isSupported()) {
    localStorage.setItem('wallets', JSON.stringify(wallets.map((item) => item.address)))
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
    } catch (e) {
      return []
    }
  } else {
    return []
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

const storeActiveRoute = (route: Route) => {
  if (!isSupported()) return
  const storedRoutes = readActiveRoutes()
  let updatedRoutes: Route[]
  if (!storedRoutes.length) {
    updatedRoutes = [route]
  } else {
    let replaced = false
    updatedRoutes = storedRoutes.map((storedRoute) => {
      if (storedRoute.id === route.id) {
        storedRoute = route
        replaced = true
      }
      return storedRoute
    })
    if (!replaced) {
      updatedRoutes.push(route)
    }
  }

  localStorage.setItem(
    'activeRoute',
    JSON.stringify(updatedRoutes, (k, v) =>
      typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v,
    ),
  )
}

const deleteRoute = (route: Route) => {
  if (!isSupported() || !route) {
    return
  }
  const storedRoutes = readAllRoutes()
  const updatedRoutes = storedRoutes.filter((storedRoute) => storedRoute.id !== route.id)

  localStorage.setItem(
    'activeRoute',
    JSON.stringify(updatedRoutes, (k, v) =>
      typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v,
    ),
  )
}

const readAllRoutes = (): Array<Route> => {
  if (!isSupported()) {
    return [] as Array<Route>
  }
  const routeString = localStorage.getItem('activeRoute')

  if (routeString) {
    try {
      const routes = JSON.parse(routeString, (k, v) => {
        const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

        return matches ? Symbol.for(matches[1]) : v
      }) as Array<Route>
      return routes as Array<Route>
    } catch (e) {
      return [] as Array<Route>
    }
  } else {
    return [] as Array<Route>
  }
}

const readHistoricalRoutes = (): Array<Route> => {
  if (!isSupported()) {
    return [] as Array<Route>
  }
  const routeString = localStorage.getItem('activeRoute')

  if (routeString) {
    try {
      const routes = JSON.parse(routeString, (k, v) => {
        const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

        return matches ? Symbol.for(matches[1]) : v
      }) as Array<Route>
      const filteredRoutes = routes.filter((route) => {
        const allDone = route.steps.every((step) => step.execution?.status === 'DONE')
        if (allDone) {
          return route
        } else {
          return null
        }
      })
      return filteredRoutes as Array<Route>
    } catch (e) {
      return [] as Array<Route>
    }
  } else {
    return [] as Array<Route>
  }
}

const readActiveRoutes = (): Array<Route> => {
  if (!isSupported()) {
    return [] as Array<Route>
  }
  const routeString = localStorage.getItem('activeRoute')

  if (routeString) {
    try {
      const routes = JSON.parse(routeString, (k, v) => {
        const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

        return matches ? Symbol.for(matches[1]) : v
      }) as Array<Route>
      const filteredRoutes = routes.filter((route) => {
        const allDone = route.steps.every((step) => step.execution?.status === 'DONE')
        if (allDone) {
          return null
        } else {
          return route
        }
      })
      return filteredRoutes as Array<Route>
    } catch (e) {
      return [] as Array<Route>
    }
  } else {
    return [] as Array<Route>
  }
}

export {
  clearLocalStorage,
  deleteRoute,
  isSupported,
  readActiveRoutes,
  readHideAbout,
  readHistoricalRoutes,
  readWallets,
  storeActiveRoute,
  storeHideAbout,
  storeWallets,
}

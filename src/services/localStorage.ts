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

// TODO: Migrating old localStorage key. Can be removed after being deployed for a while (17.12.2021)
const migrateOldProperties = () => {
  if (!isSupported()) return
  const alreadyMigrated = localStorage.getItem('routes')
  if (alreadyMigrated) return

  const oldRoutes = localStorage.getItem('activeRoute')
  if (oldRoutes) {
    localStorage.setItem('routes', oldRoutes)
  }
  localStorage.removeItem('activeRoute')
}

migrateOldProperties()

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

const storeRoute = (route: Route) => {
  if (!isSupported()) return
  const storedRoutes = readAllRoutes()
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

  localStorage.setItem('routes', JSON.stringify(updatedRoutes))
}

const deleteRoute = (route: Route) => {
  if (!isSupported() || !route) {
    return
  }
  const storedRoutes = readAllRoutes()
  const updatedRoutes = storedRoutes.filter((storedRoute) => storedRoute.id !== route.id)

  localStorage.setItem('routes', JSON.stringify(updatedRoutes))
}

const readAllRoutes = (): Array<Route> => {
  if (!isSupported()) {
    return [] as Array<Route>
  }
  const routeString = localStorage.getItem('routes')

  if (routeString) {
    try {
      const routes = JSON.parse(routeString) as Array<Route>
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
  const routes = readAllRoutes()
  return routes.filter((route) => route.steps.every((step) => step.execution?.status === 'DONE'))
}

const readActiveRoutes = (): Array<Route> => {
  if (!isSupported()) {
    return [] as Array<Route>
  }
  const routes = readAllRoutes()
  return routes.filter((route) => !route.steps.every((step) => step.execution?.status === 'DONE'))
}

export {
  clearLocalStorage,
  deleteRoute,
  isSupported,
  readActiveRoutes,
  readHideAbout,
  readHistoricalRoutes,
  readWallets,
  storeHideAbout,
  storeRoute,
  storeWallets,
}

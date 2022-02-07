import {
  readDeactivatedWallets,
  readWallets,
  sortRoutesByExecutionDate,
  storeDeactivatedWallets,
  storeWallets,
} from './localStorage'
import { getRoute } from './localStorage.fixture'

const SOME_NEWER_DATE = new Date('2021-04-10').getTime()
const SOME_OLDER_DATE = new Date('2020-04-10').getTime()

afterAll(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterEach(() => {
  localStorage.clear()
})

describe('localStorage', () => {
  describe('reading and writing Wallets', () => {
    const walletString1 = '1234'
    const walletString2 = '7890'
    describe('writing wallets', () => {
      it('should correctly store ACTIVE wallets', () => {
        jest.spyOn(window.localStorage.__proto__, 'setItem')
        storeWallets([walletString1])
        expect(localStorage.setItem).toBeCalledWith('wallets', JSON.stringify([walletString1]))
      })

      it('should not store duplicate addresses of ACTIVE wallets', () => {
        jest.spyOn(window.localStorage.__proto__, 'setItem')
        const duplicateArray = [walletString1, walletString1, walletString2, walletString2]
        storeWallets(duplicateArray)
        const noDuplicateString = JSON.stringify([walletString1, walletString2])
        expect(localStorage.setItem).toBeCalledWith('wallets', noDuplicateString)
      })

      it('should correctly store DEACTIVATED wallets', () => {
        jest.spyOn(window.localStorage.__proto__, 'setItem')
        storeDeactivatedWallets([walletString1])
        expect(localStorage.setItem).toBeCalledWith(
          'deactivatedWallets',
          JSON.stringify([walletString1]),
        )
      })
      it('should not store duplicate addresses of DEACTIVATED wallets', () => {
        jest.spyOn(window.localStorage.__proto__, 'setItem')
        const duplicateArray = [walletString1, walletString1, walletString2, walletString2]
        storeDeactivatedWallets(duplicateArray)
        const noDuplicateString = JSON.stringify([walletString1, walletString2])
        expect(localStorage.setItem).toBeCalledWith('deactivatedWallets', noDuplicateString)
      })
    })

    describe('reading wallets (testing 0, 1, n wallets)', () => {
      describe('when 0 wallets stored', () => {
        it('ACTIVE wallets: should return empty array', () => {
          const emptyaddress = readWallets()
          expect(emptyaddress).toStrictEqual([])
        })
        it('DEACTIVATED wallets: should return empty array', () => {
          const emptyaddress = readDeactivatedWallets()
          expect(emptyaddress).toStrictEqual([])
        })
      })

      describe('when 1 wallet stored', () => {
        it('ACTIVE wallets: should return wallet array', () => {
          storeWallets([walletString1])
          const walletArray = readWallets()
          expect(walletArray).toStrictEqual([walletString1])
        })

        it('DEACTIVATED wallets: should return wallet array', () => {
          storeDeactivatedWallets([walletString1])
          const walletArray = readDeactivatedWallets()
          expect(walletArray).toStrictEqual([walletString1])
        })
      })

      describe('when n wallets stored', () => {
        it('ACTIVE wallets: should return wallet array', () => {
          storeWallets([walletString1, walletString2])
          const walletArray = readWallets()
          expect(walletArray).toStrictEqual([walletString1, walletString2])
        })

        it('DEACTIVATED wallets: should return wallet array', () => {
          storeDeactivatedWallets([walletString1, walletString2])
          const walletArray = readDeactivatedWallets()
          expect(walletArray).toStrictEqual([walletString1, walletString2])
        })
      })
    })
  })
  describe('sortRoutesByExecutionDate', () => {
    describe("When routes don't have an execution", () => {
      const SOME_ROUTE_WITHOUT_EXECUTION = getRoute({ includingExecution: false })
      const SOME_ROUTE_WITH_EXECUTION = getRoute({ includingExecution: true })

      it('should move them to the start of the list', () => {
        let sortedRoutes = sortRoutesByExecutionDate([
          SOME_ROUTE_WITHOUT_EXECUTION,
          SOME_ROUTE_WITH_EXECUTION,
        ])

        expect(sortedRoutes[0].id).toEqual(SOME_ROUTE_WITHOUT_EXECUTION.id)

        sortedRoutes = sortRoutesByExecutionDate([
          SOME_ROUTE_WITH_EXECUTION,
          SOME_ROUTE_WITHOUT_EXECUTION,
        ])

        expect(sortedRoutes[0].id).toEqual(SOME_ROUTE_WITHOUT_EXECUTION.id)
      })
    })

    describe('When routes have an execution', () => {
      const SOME_NEWER_ROUTE = getRoute({ executionTime: SOME_NEWER_DATE })
      const SOME_OLDER_ROUTE = getRoute({ executionTime: SOME_OLDER_DATE })

      it('should move newer routes to the start of the list', () => {
        let sortedRoutes = sortRoutesByExecutionDate([SOME_NEWER_ROUTE, SOME_OLDER_ROUTE])

        expect(sortedRoutes[0].id).toEqual(SOME_NEWER_ROUTE.id)

        sortedRoutes = sortRoutesByExecutionDate([SOME_OLDER_ROUTE, SOME_NEWER_ROUTE])

        expect(sortedRoutes[0].id).toEqual(SOME_NEWER_ROUTE.id)
      })
    })
  })
})

import { sortRoutesByExecutionDate } from './localStorage'
import { getRoute } from './localStorage.fixture'

const SOME_NEWER_DATE = new Date('2021-04-10').getTime()
const SOME_OLDER_DATE = new Date('2020-04-10').getTime()

describe('localStorage', () => {
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

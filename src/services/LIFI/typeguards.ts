import { RouteOptions, RoutesRequest } from '../../types'

export const isRoutesRequest = (routesRequest: RoutesRequest): routesRequest is RoutesRequest => {
  const { fromChainId, fromAmount, fromTokenAddress, toChainId, toTokenAddress, options } =
    routesRequest

  return (
    typeof fromChainId === 'number' &&
    typeof fromAmount === 'string' &&
    fromAmount !== '' &&
    typeof fromTokenAddress === 'string' &&
    fromTokenAddress !== '' &&
    typeof toChainId === 'number' &&
    typeof toTokenAddress === 'string' &&
    toTokenAddress !== '' &&
    (!options || isRoutesOptions(options))
  )
}

const isRoutesOptions = (routeOptions: RouteOptions): routeOptions is RouteOptions => {
  return !routeOptions?.slippage || typeof routeOptions.slippage === 'number'
}

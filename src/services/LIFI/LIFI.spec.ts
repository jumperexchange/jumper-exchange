import { ChainId, ChainKey, CoinKey, findDefaultCoinOnChain, RoutesRequest } from '@lifinance/types'
import axios from 'axios'

import Lifi from './Lifi'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const getRoutesRequest = ({
  fromChainId = ChainId.BSC,
  fromAmount = '10000000000000',
  fromTokenAddress = findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC).id,
  toChainId = ChainId.DAI,
  toTokenAddress = findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI).id,
  options = { slippage: 0.03 },
}: any): RoutesRequest => ({
  fromChainId,
  fromAmount,
  fromTokenAddress,
  toChainId,
  toTokenAddress,
  options,
})

describe('LIFI SDK', () => {
  describe('getRoutes', () => {
    describe('user input is invalid', () => {
      it('should throw Error because of invalid fromChainId type', async () => {
        const request = getRoutesRequest({ fromChainId: 'xxx' })

        await expect(Lifi.getRoutes(request)).rejects.toThrow('Invalid routes request')
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid fromAmount type', async () => {
        const request = getRoutesRequest({ fromAmount: 10000000000000 })

        await expect(Lifi.getRoutes(request)).rejects.toThrow('Invalid routes request')
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid fromTokenAddress type', async () => {
        const request = getRoutesRequest({ fromTokenAddress: 1234 })

        await expect(Lifi.getRoutes(request)).rejects.toThrow('Invalid routes request')
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid toChainId type', async () => {
        const request = getRoutesRequest({ toChainId: 'xxx' })

        await expect(Lifi.getRoutes(request)).rejects.toThrow('Invalid routes request')
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid toTokenAddress type', async () => {
        const request = getRoutesRequest({ toTokenAddress: '' })

        await expect(Lifi.getRoutes(request)).rejects.toThrow('Invalid routes request')
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid options type', async () => {
        const request = getRoutesRequest({ options: { slippage: 'not a number' } })

        await expect(Lifi.getRoutes(request)).rejects.toThrow('Invalid routes request')
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })
    })

    describe('user input is valid', () => {
      it('should call server once', async () => {
        const request = getRoutesRequest({})
        // axios.post always returns an object and we expect that in our code
        mockedAxios.post.mockReturnValue(Promise.resolve({}))

        Lifi.getRoutes(request)
        expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      })
    })
  })
})

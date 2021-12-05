import {
  Action,
  ChainId,
  ChainKey,
  CoinKey,
  Estimate,
  findDefaultCoinOnChain,
  RoutesRequest,
  Step,
} from '@lifinance/types'
import axios from 'axios'

import Lifi from './Lifi'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('LIFI SDK', () => {
  describe('getRoutes', () => {
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

    describe('user input is invalid', () => {
      it('should throw Error because of invalid fromChainId type', async () => {
        const request = getRoutesRequest({ fromChainId: 'xxx' })

        await expect(Lifi.getRoutes(request)).rejects.toThrow(
          'SDK Validation: Invalid Routs Request',
        )
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid fromAmount type', async () => {
        const request = getRoutesRequest({ fromAmount: 10000000000000 })

        await expect(Lifi.getRoutes(request)).rejects.toThrow(
          'SDK Validation: Invalid Routs Request',
        )
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid fromTokenAddress type', async () => {
        const request = getRoutesRequest({ fromTokenAddress: 1234 })

        await expect(Lifi.getRoutes(request)).rejects.toThrow(
          'SDK Validation: Invalid Routs Request',
        )
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid toChainId type', async () => {
        const request = getRoutesRequest({ toChainId: 'xxx' })

        await expect(Lifi.getRoutes(request)).rejects.toThrow(
          'SDK Validation: Invalid Routs Request',
        )
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid toTokenAddress type', async () => {
        const request = getRoutesRequest({ toTokenAddress: '' })

        await expect(Lifi.getRoutes(request)).rejects.toThrow(
          'SDK Validation: Invalid Routs Request',
        )
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid options type', async () => {
        const request = getRoutesRequest({ options: { slippage: 'not a number' } })

        await expect(Lifi.getRoutes(request)).rejects.toThrow(
          'SDK Validation: Invalid Routs Request',
        )
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

  describe('getStepTransaction', () => {
    const getAction = ({
      fromChainId = ChainId.BSC,
      fromAmount = '10000000000000',
      fromToken = findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
      fromAddress = 'some from address', // we don't validate the format of addresses atm
      toChainId = ChainId.DAI,
      toToken = findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
      toAddress = 'some to address',
      slippage = 0.03,
    }): Action => ({
      fromChainId,
      fromAmount,
      fromToken,
      fromAddress,
      toChainId,
      toToken,
      toAddress,
      slippage,
    })

    const getEstimate = ({
      fromAmount = '10000000000000',
      toAmount = '10000000000000',
      toAmountMin = '999999999999',
      approvalAddress = 'some approval address', // we don't validate the format of addresses atm;
    }): Estimate => ({
      fromAmount,
      toAmount,
      toAmountMin,
      approvalAddress,
    })

    const getStep = ({
      id = 'some random id',
      type = 'swap',
      tool = 'some swap tool',
      action = getAction({}),
      estimate = getEstimate({}),
    }: any): Step => ({
      id,
      type,
      tool,
      action,
      estimate,
    })

    describe('with a swap step', () => {
      // While the validation fails for some users we should not enforce it
      describe.skip('user input is invalid', () => {
        it('should throw Error because of invalid id', async () => {
          const step = getStep({ id: null })

          await expect(Lifi.getStepTransaction(step)).rejects.toThrow(
            'SDK Validation: Invalid Step',
          )
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })

        it('should throw Error because of invalid type', async () => {
          const step = getStep({ type: 42 })

          await expect(Lifi.getStepTransaction(step)).rejects.toThrow(
            'SDK Validation: Invalid Step',
          )
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })

        it('should throw Error because of invalid tool', async () => {
          const step = getStep({ tool: null })

          await expect(Lifi.getStepTransaction(step)).rejects.toThrow(
            'SDK Validation: Invalid Step',
          )
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })

        // more indepth checks for the action type should be done once we have real schema validation
        it('should throw Error because of invalid action', async () => {
          const step = getStep({ action: 'xxx' })

          await expect(Lifi.getStepTransaction(step)).rejects.toThrow(
            'SDK Validation: Invalid Step',
          )
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })

        // more indepth checks for the estimate type should be done once we have real schema validation
        it('should throw Error because of invalid estimate', async () => {
          const step = getStep({ estimate: 'Is this really an estimate?' })

          await expect(Lifi.getStepTransaction(step)).rejects.toThrow(
            'SDK Validation: Invalid Step',
          )
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
      })

      describe('user input is valid', () => {
        it('should call server once', async () => {
          const step = getStep({})
          mockedAxios.post.mockReturnValue(Promise.resolve({}))

          Lifi.getStepTransaction(step)
          expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})

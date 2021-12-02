import {
  Action,
  ChainId,
  ChainKey,
  CoinKey,
  Estimate,
  findDefaultCoinOnChain,
  RoutesRequest,
  Step,
  Token,
} from '@lifinance/types'
import axios from 'axios'

import balances from './balances'
import Lifi from './Lifi'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('./balances')
const mockedBalances = balances as jest.Mocked<typeof balances>

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
      describe('user input is invalid', () => {
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

  describe('getTokenBalance', () => {
    const SOME_TOKEN = findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI)
    const SOME_WALLET_ADDRESS = 'some wallet address'

    describe('user input is invalid', () => {
      it('should throw Error because of missing walletAddress', async () => {
        await expect(Lifi.getTokenBalance('', SOME_TOKEN)).rejects.toThrow(
          'SDK Validation: Missing walletAddress',
        )

        expect(mockedBalances.getTokenBalance).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of invalid token', async () => {
        await expect(
          Lifi.getTokenBalance(SOME_WALLET_ADDRESS, { not: 'a token' } as unknown as Token),
        ).rejects.toThrow('SDK Validation: Invalid token passed')

        expect(mockedBalances.getTokenBalance).toHaveBeenCalledTimes(0)
      })
    })

    describe('user input is valid', () => {
      it('should call the balance service', async () => {
        const balanceResponse = {
          ...SOME_TOKEN,
          amount: '123',
        }

        mockedBalances.getTokenBalance.mockReturnValue(Promise.resolve(balanceResponse))

        const result = await Lifi.getTokenBalance(SOME_WALLET_ADDRESS, SOME_TOKEN)

        expect(mockedBalances.getTokenBalance).toHaveBeenCalledTimes(1)
        expect(result).toEqual(balanceResponse)
      })
    })
  })

  describe.only('getTokenBalances', () => {
    const SOME_TOKEN = findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI)
    const SOME_WALLET_ADDRESS = 'some wallet address'

    describe('user input is invalid', () => {
      it('should throw Error because of missing walletAddress', async () => {
        await expect(Lifi.getTokenBalances('', [SOME_TOKEN])).rejects.toThrow(
          'SDK Validation: Missing walletAddress',
        )

        expect(mockedBalances.getTokenBalances).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of an invalid token', async () => {
        await expect(
          Lifi.getTokenBalances(SOME_WALLET_ADDRESS, [
            SOME_TOKEN,
            { not: 'a token' } as unknown as Token,
          ]),
        ).rejects.toThrow('SDK Validation: Invalid token passed')

        expect(mockedBalances.getTokenBalances).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of an empty token list', async () => {
        await expect(Lifi.getTokenBalances(SOME_WALLET_ADDRESS, [])).rejects.toThrow(
          'SDK Validation: Empty token list passed',
        )

        expect(mockedBalances.getTokenBalances).toHaveBeenCalledTimes(0)
      })
    })

    describe('user input is valid', () => {
      it('should call the balance service', async () => {
        const balanceResponse = [
          {
            ...SOME_TOKEN,
            amount: '123',
          },
        ]

        mockedBalances.getTokenBalances.mockReturnValue(Promise.resolve(balanceResponse))

        const result = await Lifi.getTokenBalances(SOME_WALLET_ADDRESS, [SOME_TOKEN])

        expect(mockedBalances.getTokenBalances).toHaveBeenCalledTimes(1)
        expect(result).toEqual(balanceResponse)
      })
    })
  })

  describe.only('getTokenBalancesForChains', () => {
    const SOME_TOKEN = findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI)
    const SOME_WALLET_ADDRESS = 'some wallet address'

    describe('user input is invalid', () => {
      it('should throw Error because of missing walletAddress', async () => {
        await expect(
          Lifi.getTokenBalancesForChains('', { [ChainId.DAI]: [SOME_TOKEN] }),
        ).rejects.toThrow('SDK Validation: Missing walletAddress')

        expect(mockedBalances.getTokenBalancesForChains).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of an invalid token', async () => {
        await expect(
          Lifi.getTokenBalancesForChains(SOME_WALLET_ADDRESS, {
            [ChainId.DAI]: [{ not: 'a token' } as unknown as Token],
          }),
        ).rejects.toThrow('SDK Validation: Invalid token passed')

        expect(mockedBalances.getTokenBalancesForChains).toHaveBeenCalledTimes(0)
      })

      it('should throw Error because of an empty token list', async () => {
        await expect(
          Lifi.getTokenBalancesForChains(SOME_WALLET_ADDRESS, {
            [ChainId.DAI]: [],
          }),
        ).rejects.toThrow('SDK Validation: Empty token list passed')

        expect(mockedBalances.getTokenBalancesForChains).toHaveBeenCalledTimes(0)
      })
    })

    describe('user input is valid', () => {
      it('should call the balance service', async () => {
        const balanceResponse = {
          [ChainId.DAI]: [
            {
              ...SOME_TOKEN,
              amount: '123',
            },
          ],
        }

        mockedBalances.getTokenBalancesForChains.mockReturnValue(Promise.resolve(balanceResponse))

        const result = await Lifi.getTokenBalancesForChains(SOME_WALLET_ADDRESS, {
          [ChainId.DAI]: [SOME_TOKEN],
        })

        expect(mockedBalances.getTokenBalancesForChains).toHaveBeenCalledTimes(1)
        expect(result).toEqual(balanceResponse)
      })
    })
  })
})

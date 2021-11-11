import {
  ChainId,
  ChainKey,
  CoinKey,
  DepositAction,
  findDefaultCoinOnChain,
  WithdrawAction,
} from '@lifinance/types'
import axios from 'axios'

import Lifi from './Lifi'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('LIFI SDK', () => {
  describe('findRoutes', () => {
    describe('user input is invalid', () => {
      describe('invalid deposit type', () => {
        it('should throw Error because of invalid type', async () => {
          const deposit = {
            type: 'deposit xxx',
            chainId: ChainId.BSC,
            amount: '10000000000000',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw: WithdrawAction = {
            type: 'withdraw',
            chainId: ChainId.DAI,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: '',
            toAddress: '',
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit as unknown as DepositAction, withdraw as WithdrawAction),
          ).rejects.toThrow('Invalid Deposit Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
        it('should throw Error because of invalid chainId type', async () => {
          const deposit = {
            type: 'deposit',
            chainId: 'xxx',
            amount: '10000000000000',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw: WithdrawAction = {
            type: 'withdraw',
            chainId: ChainId.DAI,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: '',
            toAddress: '',
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit as unknown as DepositAction, withdraw as WithdrawAction),
          ).rejects.toThrow('Invalid Deposit Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
        it('should throw Error because of invalid amount type', async () => {
          const deposit = {
            type: 'deposit',
            chainId: ChainId.BSC,
            amount: 10000000000000,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw: WithdrawAction = {
            type: 'withdraw',
            chainId: ChainId.DAI,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: '',
            toAddress: '',
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit as unknown as DepositAction, withdraw as WithdrawAction),
          ).rejects.toThrow('Invalid Deposit Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
        it('should throw Error because of invalid token type', async () => {
          const deposit = {
            type: 'deposit xxx',
            chainId: ChainId.BSC,
            amount: '10000000000000',
            token: { thisIs: 'wrong' },
          }

          const withdraw: WithdrawAction = {
            type: 'withdraw',
            chainId: ChainId.DAI,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: '',
            toAddress: '',
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit as unknown as DepositAction, withdraw as WithdrawAction),
          ).rejects.toThrow('Invalid Deposit Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
      })

      describe('invalid withdraw types', () => {
        it('should throw Error because of invalid type', async () => {
          const deposit: DepositAction = {
            type: 'deposit',
            chainId: ChainId.BSC,
            amount: '10000000000000',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw = {
            type: 'withdraw xxx',
            chainId: ChainId.DAI,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: '',
            toAddress: '',
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction),
          ).rejects.toThrow('Invalid Withdraw Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
        it('should throw Error because of invalid chainId', async () => {
          const deposit: DepositAction = {
            type: 'deposit',
            chainId: ChainId.BSC,
            amount: '10000000000000',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw = {
            type: 'withdraw',
            chainId: 'ChainId.DAI',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: '',
            toAddress: '',
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit, withdraw as unknown as WithdrawAction),
          ).rejects.toThrow('Invalid Withdraw Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
        it('should throw Error because of invalid token type', async () => {
          const deposit: DepositAction = {
            type: 'deposit',
            chainId: ChainId.BSC,
            amount: '10000000000000',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw = {
            type: 'withdraw',
            chainId: ChainId.DAI,
            token: { thisIs: 'wrong' },
            amount: '',
            toAddress: '',
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction),
          ).rejects.toThrow('Invalid Withdraw Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
        it('should throw Error because of invalid amount type', async () => {
          const deposit: DepositAction = {
            type: 'deposit',
            chainId: ChainId.BSC,
            amount: '10000000000000',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw = {
            type: 'withdraw',
            chainId: ChainId.DAI,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: 5000,
            toAddress: '',
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction),
          ).rejects.toThrow('Invalid Withdraw Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
        it('should throw Error because of invalid toAddress type', async () => {
          const deposit: DepositAction = {
            type: 'deposit',
            chainId: ChainId.BSC,
            amount: '10000000000000',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw = {
            type: 'withdraw',
            chainId: ChainId.DAI,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: '10000000000000',
            toAddress: 1230099988888,
            slippage: 0.03,
          }

          await expect(
            Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction),
          ).rejects.toThrow('Invalid Withdraw Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
        it('should throw Error because of invalid slippage type', async () => {
          const deposit: DepositAction = {
            type: 'deposit',
            chainId: ChainId.BSC,
            amount: '10000000000000',
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
          }

          const withdraw = {
            type: 'withdraw',
            chainId: ChainId.DAI,
            token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
            amount: '10000000000000',
            toAddress: '',
            slippage: 'xxx',
          }

          await expect(
            Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction),
          ).rejects.toThrow('Invalid Withdraw Type')
          expect(mockedAxios.post).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('user input is valid', () => {
      it('should call server once', async () => {
        const deposit: DepositAction = {
          type: 'deposit',
          chainId: ChainId.BSC,
          amount: '10000000000000',
          token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
        }

        const withdraw: WithdrawAction = {
          type: 'withdraw',
          chainId: ChainId.DAI,
          token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
          amount: '',
          toAddress: '',
          slippage: 0.03,
        }

        Lifi.findRoutes(deposit, withdraw)
        expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      })
    })
  })
})

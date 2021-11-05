import axios, {AxiosStatic} from 'axios'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked< typeof axios >


import { ChainId, ChainKey, CoinKey } from '../../types/shared/base.types'
import {findDefaultCoinOnChain} from '../../types/shared/coins.types'
import { DepositAction, WithdrawAction } from '../../types/shared/step.types'
import Lifi from './Lifi'

describe('LIFI SDK', () => {
  describe('findRoutes', () => {
    describe('user input is invalid', () => {
      it('should throw invalid deposit type', async () => {
        const deposit = {
          type: 'deposit xxx',
          chainId: ChainId.BSC,
          amount: '10000000000000',
          token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC)
        }

        const withdraw: WithdrawAction = {
          type: 'withdraw',
          chainId: ChainId.DAI,
          token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
          amount: '',
          toAddress: '',
          slippage: 0.03,
        }

        await expect(Lifi.findRoutes(deposit as unknown as DepositAction, withdraw as WithdrawAction)).rejects.toThrow('Invalid Deposit Type');
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)


      })
      it.skip('should throw invalid withdraw type', async () => {
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

        await expect(Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction)).rejects.toThrow('Invalid Withdraw Type');
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })
    })

    describe.skip('user input is valid',  () => {
      it('should call server once', async () => {
        const deposit: DepositAction = {
          type: 'deposit',
          chainId: ChainId.BSC,
          amount: '10000000000000',
          token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC)
        }

        const withdraw: WithdrawAction = {
          type: 'withdraw',
          chainId: ChainId.DAI,
          token: findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
          amount: '',
          toAddress: '',
          slippage: 0.03,
        }

        Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction)
        expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      })
    })

  })


})

import axios, {AxiosStatic} from 'axios'
jest.mock('axios')

const mockedAxios = axios as jest.Mocked< typeof axios >


import { DepositAction, WithdrawAction } from '../../types'
import Lifi from './Lifi'

describe('LIFI', () => {
  describe('findRoutes', () => {
    describe('user input is invalid', () => {
      it('should throw invalid deposit type', async () => {
        const deposit = {
          type: 'withdraw',
          chainId: '1',
          token: {},
          amount: 1
        }

        const withdraw = {
          type: 'withdraw',
          chainId: 1,
          token: {}, // TODO: add valid token
          amount: '',
          toAddress: '',
          slippage: 3 / 100,
        }

        await expect(Lifi.findRoutes(deposit as unknown as DepositAction, withdraw as WithdrawAction)).rejects.toThrow('Invalid Deposit Type');
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)


      })
      it('should throw invalid withdraw type', async () => {
        const deposit = {
          type: 'deposit',
          chainId: 1,
          token: {},
          amount: '1'
        }

        const withdraw = {
          type: 'herbert',
          chainId: '1',
          token: {}, // TODO: add valid token
          amount: '',
          toAddress: '',
          slippage: 3 / 100,
        }

        await expect(Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction)).rejects.toThrow('Invalid Withdraw Type');
        expect(mockedAxios.post).toHaveBeenCalledTimes(0)
      })
    })

    describe('user input is valid',  () => {
      it('should call server once', async () => {
        const deposit = {
          type: 'deposit',
          chainId: 1,
          token: {},
          amount: '1'
        }

        const withdraw = {
          type: 'withdraw',
          chainId: 1,
          token: {}, // TODO: add valid token
          amount: '',
          toAddress: '',
          slippage: 3 / 100,
        }

        Lifi.findRoutes(deposit as DepositAction, withdraw as unknown as WithdrawAction)
        expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      })
    })

  })


})

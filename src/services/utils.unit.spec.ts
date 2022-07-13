import { ChainId, CoinKey, findDefaultToken } from '@lifi/sdk'
import BigNumber from 'bignumber.js'

import { formatTokenAmountOnly, parseSecondsAsTime } from './utils'

const SOME_TOKEN = findDefaultToken(CoinKey.USDC, ChainId.DAI)

describe('utils', () => {
  describe('formatTokenAmountOnly', () => {
    describe('when the value is falsy or 0', () => {
      it('should parse undefined as 0.0', () => {
        expect(formatTokenAmountOnly(SOME_TOKEN, undefined)).toEqual('0.0')
      })

      it("should parse '' as 0.0", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN, '')).toEqual('0.0')
      })

      it("should parse '0' as 0.0", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN, '0')).toEqual('0.0')
      })

      it("should parse BigNumber('0') as 0.0", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN, new BigNumber('0'))).toEqual('0.0')
      })
    })

    describe('when the token has 18 decimals', () => {
      const SOME_TOKEN_WITH_18_DECIMALS = {
        address: 'some address',
        decimals: 18,
        symbol: 'USDC',
        chainId: 100 as ChainId,
        coinKey: 'USDC' as CoinKey,
        name: 'USDC',
      }

      it("should parse '11' as 0.000000000000000011", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_18_DECIMALS, '11')).toEqual(
          '0.000000000000000011',
        )
      })

      it("should parse '1999' as 0.0000000000000019", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_18_DECIMALS, '1999')).toEqual(
          '0.0000000000000019',
        )
      })

      it("should parse BigNumber('11') as 11.0000", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_18_DECIMALS, new BigNumber('11'))).toEqual(
          '11.0000',
        )
      })
    })

    describe('when the token has 1 decimals', () => {
      const SOME_TOKEN_WITH_1_DECIMAL = {
        address: 'some address',
        decimals: 1,
        symbol: 'USDC',
        chainId: 100 as ChainId,
        coinKey: 'USDC' as CoinKey,
        name: 'USDC',
      }

      it("should parse '11' as 1.1000", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_1_DECIMAL, '11')).toEqual('1.1000')
      })

      it("should parse '1999' as 199.9000", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_1_DECIMAL, '1999')).toEqual('199.9000')
      })

      it("should parse BigNumber('11') as 11.0000", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_1_DECIMAL, new BigNumber('11'))).toEqual(
          '11.0000',
        )
      })
    })

    describe('when the token has 0 decimals', () => {
      const SOME_TOKEN_WITH_0_DECIMALS = {
        address: 'some address',
        decimals: 0,
        symbol: 'USDC',
        chainId: 100 as ChainId,
        coinKey: 'USDC' as CoinKey,
        name: 'USDC',
      }

      it("should parse '11' as 11.000", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_0_DECIMALS, '11')).toEqual('11.0000')
      })

      it("should parse '1999' as 1999.0000", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_0_DECIMALS, '1999')).toEqual('1999.0000')
      })

      it("should parse BigNumber('11') as 11.0000", () => {
        expect(formatTokenAmountOnly(SOME_TOKEN_WITH_0_DECIMALS, new BigNumber('11'))).toEqual(
          '11.0000',
        )
      })
    })
  })

  describe('parseSecondsAsTime', () => {
    describe('when the passed value is not a number', () => {
      it('should return a placeholder', () => {
        const time = parseSecondsAsTime('what?' as unknown as number)
        expect(time).toEqual(' - ')
      })
    })

    describe('when the passed value is below zero', () => {
      it('should return a placeholder', () => {
        const time = parseSecondsAsTime(-5)
        expect(time).toEqual(' - ')
      })
    })

    describe('when the passed value is valid', () => {
      describe('and it has a one digit amount of seconds', () => {
        it('should add a padding 0', () => {
          const time = parseSecondsAsTime(61)
          expect(time).toEqual('1:01')
        })
      })

      describe('and it has a two digit amount of seconds', () => {
        it('should not add a padding 0', () => {
          const time = parseSecondsAsTime(83)
          expect(time).toEqual('1:23')
        })
      })

      describe('and it contains a fraction', () => {
        it('should round to 2 digits', () => {
          const time = parseSecondsAsTime(83.12345)
          expect(time).toEqual('1:24')
        })
      })
    })
  })
})

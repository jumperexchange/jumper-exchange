import type { StaticToken, Token, TokenExtended } from '@lifi/sdk';
import { CoinKey, type TokenTag } from '@lifi/widget';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Token as JumperToken } from '@/types/jumper-backend';
import { ExtendedToken, SimpleToken } from './Token';

const STATIC_TOKEN_FIXTURE: StaticToken = {
  chainId: 100,
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'xDAI',
  name: 'xDAI Native Token',
  decimals: 18,
  coinKey: CoinKey.DAI,
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  tags: ['stablecoin' as TokenTag.STABLECOIN],
};

const JUMPER_TOKEN_FIXTURE: JumperToken = {
  chain: {
    chainId: 100,
    chainKey: 'dai',
  },
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'xDAI',
  name: 'xDAI Native Token',
  decimals: 18,
  logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};

const TOKEN_FIXTURE: Token = {
  chainId: 100,
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'xDAI',
  name: 'xDAI Native Token',
  decimals: 18,
  priceUSD: '0.812',
  coinKey: CoinKey.DAI,
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
};

const EXTENDED_TOKEN_FIXTURE: TokenExtended = {
  chainId: 100,
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'xDAI',
  name: 'xDAI Native Token',
  decimals: 18,
  priceUSD: '0.99972137',
  coinKey: CoinKey.DAI,
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  marketCapUSD: null,
  volumeUSD24H: 732678,
};

describe('SimpleToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create SimpleToken from StaticToken', () => {
      const token = new SimpleToken(STATIC_TOKEN_FIXTURE);

      expect(token.chainId).toBe(100);
      expect(token.address).toBe('0x0000000000000000000000000000000000000000');
      expect(token.symbol).toBe('xDAI');
      expect(token.name).toBe('xDAI Native Token');
      expect(token.decimals).toBe(18);
      expect(token.logoURI).toBe(
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      );
      expect(token.coinKey).toBe('DAI');
      expect(token.tags).toEqual(['stablecoin']);
    });

    it('should create SimpleToken from JumperToken', () => {
      const token = new SimpleToken(JUMPER_TOKEN_FIXTURE);

      expect(token.chainId).toBe(100);
      expect(token.address).toBe('0x0000000000000000000000000000000000000000');
      expect(token.symbol).toBe('xDAI');
      expect(token.name).toBe('xDAI Native Token');
      expect(token.decimals).toBe(18);
      expect(token.logoURI).toBe(
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      );
      expect(token.coinKey).toBeUndefined();
      expect(token.tags).toBeUndefined();
    });
  });

  describe('formatAmount', () => {
    it('should format amount with string input', () => {
      const token = new SimpleToken(STATIC_TOKEN_FIXTURE);

      const result = token.formatAmount('1000000000000000000');

      expect(result).toBe('1 xDAI');
    });

    it('should format amount with number input', () => {
      const token = new SimpleToken({ ...STATIC_TOKEN_FIXTURE, decimals: 6 });

      const result = token.formatAmount(2500000);

      expect(result).toBe('2.5 xDAI');
    });

    it('should format amount with bigint input', () => {
      const token = new SimpleToken(STATIC_TOKEN_FIXTURE);

      const result = token.formatAmount(10000000000000000000n);

      expect(result).toBe('10 xDAI');
    });

    it('should format small fractional amount', () => {
      const token = new SimpleToken(STATIC_TOKEN_FIXTURE);

      const result = token.formatAmount('14353125728879');

      expect(result).toBe('0.000014353125728879 xDAI');
    });

    it('should handle token with no symbol', () => {
      const token = new SimpleToken({
        ...STATIC_TOKEN_FIXTURE,
        symbol: '',
      });

      const result = token.formatAmount('1000000000000000000');

      expect(result).toBe('1 ---');
    });
  });

  describe('formatZeroAmount', () => {
    it('should format zero amount', () => {
      const token = new SimpleToken(STATIC_TOKEN_FIXTURE);

      const result = token.formatZeroAmount();

      expect(result).toBe('0 xDAI');
    });
  });

  describe('formatZeroUSD', () => {
    it('should format zero USD', () => {
      const token = new SimpleToken(STATIC_TOKEN_FIXTURE);

      const result = token.formatZeroUSD();
      expect(result).toBe('$0.00');
    });
  });
});

describe('ExtendedToken', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should create ExtendedToken from Token', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      expect(token.chainId).toBe(100);
      expect(token.address).toBe('0x0000000000000000000000000000000000000000');
      expect(token.priceUSD).toBe('0.812');
      expect(token.marketCapUSD).toBeUndefined();
      expect(token.volumeUSD24H).toBeUndefined();
      expect(token.fdvUSD).toBeUndefined();
    });

    it('should create ExtendedToken from TokenExtended with market data', () => {
      const token = new ExtendedToken(EXTENDED_TOKEN_FIXTURE);

      expect(token.chainId).toBe(100);
      expect(token.address).toBe('0x0000000000000000000000000000000000000000');
      expect(token.priceUSD).toBe('0.99972137');
      expect(token.marketCapUSD).toBe(null);
      expect(token.volumeUSD24H).toBe(732678);
      expect(token.fdvUSD).toBeUndefined();
    });
  });

  describe('hasPriceUSD', () => {
    it('should return true when price is greater than 0', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      expect(token.hasPriceUSD()).toBe(true);
    });

    it('should return false when price is 0', () => {
      const token = new ExtendedToken({
        ...TOKEN_FIXTURE,
        priceUSD: '0',
      });

      expect(token.hasPriceUSD()).toBe(false);
    });

    it('should return false when price is 0.0', () => {
      const token = new ExtendedToken({
        ...TOKEN_FIXTURE,
        priceUSD: '0.0',
      });

      expect(token.hasPriceUSD()).toBe(false);
    });
  });

  describe('formatPriceUSD', () => {
    it('should format price in USD', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      const result = token.formatPriceUSD();

      expect(result).toBe('$0.81');
    });

    it('should format high price in USD', () => {
      const token = new ExtendedToken({
        ...EXTENDED_TOKEN_FIXTURE,
        priceUSD: '123.456',
      });

      const result = token.formatPriceUSD();

      expect(result).toBe('$123.46');
    });

    it('should return undefined and log error when price is missing', () => {
      const token = new ExtendedToken({
        ...TOKEN_FIXTURE,
        priceUSD: '',
      });

      const result = token.formatPriceUSD();

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Token formatPriceUSD: Could not find price for token with address 0x0000000000000000000000000000000000000000`,
      );
    });
  });

  describe('formatAmountUSD', () => {
    it('should format amount in USD with string input', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      const result = token.formatAmountUSD('10000000000000000000');

      expect(result).toBe('$8.12');
    });

    it('should format amount in USD with number input', () => {
      const token = new ExtendedToken({ ...TOKEN_FIXTURE, decimals: 6 });

      const result = token.formatAmountUSD(2500000);

      expect(result).toBe('$2.03');
    });

    it('should format amount in USD with bigint input', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      const result = token.formatAmountUSD(10000000000000000000n);

      expect(result).toBe('$8.12');
    });

    it('should format amount in USD with high price token', () => {
      const token = new ExtendedToken({
        ...EXTENDED_TOKEN_FIXTURE,
        priceUSD: '1234.56',
      });

      const result = token.formatAmountUSD('1000000000000000000');

      expect(result).toBe('$1.23K');
    });

    it('should format zero USD when price is missing', () => {
      const token = new ExtendedToken({
        ...TOKEN_FIXTURE,
        priceUSD: '',
      });

      const result = token.formatAmountUSD('1000000000000000000');

      expect(result).toBe('$0.00');
    });
  });

  describe('formatAmountFromUSD', () => {
    it('should format token amount from USD with string input', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      const result = token.formatAmountFromUSD('1.0');

      expect(result).toBe('1.231527093596059 xDAI');
    });

    it('should format token amount from USD with number input', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      const result = token.formatAmountFromUSD(2.5);

      expect(result).toBe('3.0788177339901477 xDAI');
    });

    it('should format token amount from USD with bigint input', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      const result = token.formatAmountFromUSD(10n);

      expect(result).toBe('12.31527093596059 xDAI');
    });

    it('should format token amount from USD with high price token', () => {
      const token = new ExtendedToken(EXTENDED_TOKEN_FIXTURE);

      const result = token.formatAmountFromUSD('1.0');

      expect(result).toBe('1.0002787076563142 xDAI');
    });

    it('should format large USD amount to token amount', () => {
      const token = new ExtendedToken(TOKEN_FIXTURE);

      const result = token.formatAmountFromUSD(1000n);

      expect(result).toBe('1231.527093596059 xDAI');
    });
  });
});

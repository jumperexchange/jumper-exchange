import type { ExtendedToken } from '@/types/tokens';
import type { Protocol } from '@/types/jumper-backend';

export const mockToken: ExtendedToken = {
  type: 'extended',
  address: '0x0000000000000000000000000000000000000000',
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  priceUSD: '3500',
  chainId: 1,
};

export const mockProtocol: Protocol = {
  name: 'Aave',
  logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/aave.com.png',
};

export const mockProgressData = {
  highProgress: { progress: 75, amount: 15000 },
  mediumProgress: { progress: 25, amount: 5000 },
  lowProgress: { progress: 5, amount: 1000 },
  tinyAmount: { progress: 0.5, amount: 0.005 },
};

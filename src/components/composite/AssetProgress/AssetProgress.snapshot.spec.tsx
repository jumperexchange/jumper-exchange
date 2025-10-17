import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../vitest.setup';
import { AssetProgress } from './AssetProgress';
import { AssetProgressVariant } from './AssetProgress.types';

const mockedTokens = [
  {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    logo: '',
    chain: {
      chainId: 1,
      chainKey: 'ETH',
    },
  },
];

vi.mock('src/hooks/useTokens', () => ({
  useTokens: () => ({
    data: {
      tokens: mockedTokens,
    },
    getTokenByAddressAndChain: (address: string, chainId: number) =>
      mockedTokens.find(
        (token) => token.address === address && token.chain.chainId === chainId,
      ),
    isSuccess: true,
    isLoading: false,
    error: null,
  }),
}));

describe('AssetProgress snapshot', () => {
  describe('Text variant', () => {
    it('text progress matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={32}
          variant={AssetProgressVariant.Text}
          text="+3"
          amount={100}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('text progress with high percentage matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={85}
          variant={AssetProgressVariant.Text}
          text="+10"
          amount={500}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('text progress with low percentage matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={5}
          variant={AssetProgressVariant.Text}
          text="+1"
          amount={25}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('text progress at 0% matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={0}
          variant={AssetProgressVariant.Text}
          text="0"
          amount={0}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('text progress at 100% matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={100}
          variant={AssetProgressVariant.Text}
          text="+20"
          amount={1000}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Token variant', () => {
    it('token progress matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={32}
          variant={AssetProgressVariant.Token}
          token={{
            address: '0x0000000000000000000000000000000000000000',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 6,
            logo: '',
            chain: { chainId: 1, chainKey: 'Ethereum' },
          }}
          amount={100}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('token progress with USDC matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={65}
          variant={AssetProgressVariant.Token}
          token={{
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 6,
            logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            chain: { chainId: 1, chainKey: 'Ethereum' },
          }}
          amount={250.5}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('token progress with large amount matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={90}
          variant={AssetProgressVariant.Token}
          token={{
            address: '0x0000000000000000000000000000000000000000',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
            logo: '',
            chain: { chainId: 1, chainKey: 'Ethereum' },
          }}
          amount={1234567.89}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('token progress with small amount matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={15}
          variant={AssetProgressVariant.Token}
          token={{
            address: '0x0000000000000000000000000000000000000000',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
            logo: '',
            chain: { chainId: 10, chainKey: 'Base' },
          }}
          amount={0.00123}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Protocol variant', () => {
    it('protocol progress matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={32}
          variant={AssetProgressVariant.Protocol}
          protocol={{
            name: 'Morpho',
            logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
            product: 'Morpho',
            version: '1.0.0',
          }}
          amount={100}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('protocol progress at 100% matches snapshot', () => {
      const { container } = render(
        <AssetProgress
          progress={100}
          variant={AssetProgressVariant.Protocol}
          protocol={{
            name: 'Morpho',
            logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
            product: 'Morpho',
            version: '1.0.0',
          }}
          amount={10500.5}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});

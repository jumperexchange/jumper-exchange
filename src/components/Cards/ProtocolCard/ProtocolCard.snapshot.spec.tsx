import { describe, expect, it, vi } from 'vitest';

import { render } from '../../../../vitest.setup';

import { ProtocolCard } from './ProtocolCard';
import { commonArgs } from './fixtures';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';

const mockedChains = [
  {
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    name: 'Ethereum',
    chainId: 1,
  },
  {
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    name: 'Base',
    chainId: 10,
  },
  {
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    name: 'Polygon',
    chainId: 137,
  },
];

vi.mock('src/hooks/useChains', () => ({
  useChains: () => ({
    data: {
      chains: mockedChains,
    },
    getChainById: (chainId: number) =>
      mockedChains.find((chain) => chain.chainId === chainId),
    isSuccess: true,
    isLoading: false,
    error: null,
  }),
}));

describe('ProtocolCard snapshot', () => {
  it('protocol card matches snapshot', async () => {
    const { container } = render(<ProtocolCard {...commonArgs} />);
    expect(container).toMatchSnapshot();
  });
  it('protocol card with loading matches snapshot', async () => {
    const { container } = render(<ProtocolCard {...commonArgs} isLoading />);
    expect(container).toMatchSnapshot();
  });
  it('protocol card with badge matches snapshot', async () => {
    const { container } = render(
      <ProtocolCard
        {...commonArgs}
        headerBadge={
          <Badge
            variant={BadgeVariant.Secondary}
            size={BadgeSize.LG}
            label="New"
          />
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('protocol card with long title matches snapshot', async () => {
    const { container } = render(
      <ProtocolCard
        {...commonArgs}
        data={{
          ...commonArgs.data,
          protocol: {
            ...commonArgs.data.protocol,
            name: 'this is a very long protocol name that should be truncated',
          },
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

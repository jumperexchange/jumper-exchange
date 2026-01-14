import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../../../vitest.setup';
import { AssetOverviewCard } from './AssetOverviewCard';
import {
  positions,
  positionsTotalValueUSD,
  tokens,
  tokensTotalValueUSD,
  tokenTinyAmounts,
  tokenTinyAmountsTotalValueUSD,
} from './fixtures';

vi.mock('src/hooks/useTokens', () => ({
  useTokens: () => ({
    data: {
      tokens: tokens,
    },
    getTokenByAddressAndChain: (address: string, chainId: number) =>
      tokens.find(
        (token) => token.address === address && token.chain.chainId === chainId,
      ),
    isSuccess: true,
    isLoading: false,
    error: null,
  }),
}));

describe('AssetOverviewCard Snapshots', () => {
  describe('OneAsset', () => {
    it('should match snapshot with one asset', () => {
      const slicedTokens = tokens.slice(0, 1);
      const slicedPositions = positions.slice(0, 1);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const slicedTokens = tokens.slice(0, 1);
      const slicedPositions = positions.slice(0, 1);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const slicedTokens = tokens.slice(0, 1);
      const slicedPositions = positions.slice(0, 1);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('TwoAssets', () => {
    it('should match snapshot with two assets', () => {
      const slicedTokens = tokens.slice(0, 2);
      const slicedPositions = positions.slice(0, 2);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const slicedTokens = tokens.slice(0, 2);
      const slicedPositions = positions.slice(0, 2);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const slicedTokens = tokens.slice(0, 2);
      const slicedPositions = positions.slice(0, 2);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('ThreeAssets', () => {
    it('should match snapshot with three assets', () => {
      const slicedTokens = tokens.slice(0, 3);
      const slicedPositions = positions.slice(0, 3);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const slicedTokens = tokens.slice(0, 3);
      const slicedPositions = positions.slice(0, 3);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const slicedTokens = tokens.slice(0, 3);
      const slicedPositions = positions.slice(0, 3);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('FourAssets', () => {
    it('should match snapshot with four assets', () => {
      const slicedTokens = tokens.slice(0, 4);
      const slicedPositions = positions.slice(0, 4);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const slicedTokens = tokens.slice(0, 4);
      const slicedPositions = positions.slice(0, 4);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const slicedTokens = tokens.slice(0, 4);
      const slicedPositions = positions.slice(0, 4);
      const { container } = render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('Overflow', () => {
    it('should match snapshot with overflow (more than 4 assets)', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens}
          tokensTotalValueUSD={tokensTotalValueUSD}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view with overflow', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens}
          tokensTotalValueUSD={tokensTotalValueUSD}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view with overflow', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens}
          tokensTotalValueUSD={tokensTotalValueUSD}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('NoTokens', () => {
    it('should match snapshot with no tokens', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={[]}
          tokensTotalValueUSD={0}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view with no tokens', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={[]}
          tokensTotalValueUSD={0}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={[]}
          tokensTotalValueUSD={0}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('NoDeFiPositions', () => {
    it('should match snapshot with no DeFi positions', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens}
          tokensTotalValueUSD={tokensTotalValueUSD}
          positions={[]}
          positionsTotalValueUSD={0}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens}
          tokensTotalValueUSD={tokensTotalValueUSD}
          positions={[]}
          positionsTotalValueUSD={0}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view with no positions', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens}
          tokensTotalValueUSD={tokensTotalValueUSD}
          positions={[]}
          positionsTotalValueUSD={0}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('TokensTinyAmounts', () => {
    it('should match snapshot with tiny token amounts', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokenTinyAmounts}
          tokensTotalValueUSD={tokenTinyAmountsTotalValueUSD}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view with tiny amounts', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokenTinyAmounts}
          tokensTotalValueUSD={tokenTinyAmountsTotalValueUSD}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokenTinyAmounts}
          tokensTotalValueUSD={tokenTinyAmountsTotalValueUSD}
          positions={positions}
          positionsTotalValueUSD={positionsTotalValueUSD}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('NoContent', () => {
    it('should match snapshot with no content', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={[]}
          tokensTotalValueUSD={0}
          positions={[]}
          positionsTotalValueUSD={0}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Navigation Interactions', () => {
    it('should navigate between all views', () => {
      const slicedTokens = tokens.slice(0, 2);
      const slicedPositions = positions.slice(0, 2);
      render(
        <AssetOverviewCard
          tokens={slicedTokens}
          tokensTotalValueUSD={slicedTokens.reduce(
            (s, t) => s + t.totalValueUSD,
            0,
          )}
          positions={slicedPositions}
          positionsTotalValueUSD={slicedPositions.reduce(
            (s, p) => s + p.totalValueUSD,
            0,
          )}
        />,
      );

      const overviewButton = screen.getByTestId('asset-overview-nav-overview');
      const tokensButton = screen.getByTestId('asset-overview-nav-tokens');
      const defiButton = screen.getByTestId('asset-overview-nav-defiPositions');

      fireEvent.click(tokensButton);
      expect(tokensButton).toHaveAttribute('class');

      fireEvent.click(defiButton);
      expect(defiButton).toHaveAttribute('class');

      fireEvent.click(overviewButton);
      expect(overviewButton).toHaveAttribute('class');
    });
  });

  describe('Loading', () => {
    it('should match snapshot with loading', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={[]}
          tokensTotalValueUSD={0}
          positions={[]}
          positionsTotalValueUSD={0}
          isLoading={true}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});

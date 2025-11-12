import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../vitest.setup';
import { AssetOverviewCard } from './AssetOverviewCard';
import { defiPositions, tokens, tokenTinyAmounts } from './fixtures';

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
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 1)}
          defiPositions={defiPositions.slice(0, 1)}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 1)}
          defiPositions={defiPositions.slice(0, 1)}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 1)}
          defiPositions={defiPositions.slice(0, 1)}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('TwoAssets', () => {
    it('should match snapshot with two assets', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 2)}
          defiPositions={defiPositions.slice(0, 2)}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 2)}
          defiPositions={defiPositions.slice(0, 2)}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 2)}
          defiPositions={defiPositions.slice(0, 2)}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('ThreeAssets', () => {
    it('should match snapshot with three assets', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 3)}
          defiPositions={defiPositions.slice(0, 3)}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 3)}
          defiPositions={defiPositions.slice(0, 3)}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 3)}
          defiPositions={defiPositions.slice(0, 3)}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('FourAssets', () => {
    it('should match snapshot with four assets', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 4)}
          defiPositions={defiPositions.slice(0, 4)}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 4)}
          defiPositions={defiPositions.slice(0, 4)}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 4)}
          defiPositions={defiPositions.slice(0, 4)}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('Overflow', () => {
    it('should match snapshot with overflow (more than 4 assets)', () => {
      const { container } = render(
        <AssetOverviewCard tokens={tokens} defiPositions={defiPositions} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view with overflow', () => {
      const { container } = render(
        <AssetOverviewCard tokens={tokens} defiPositions={defiPositions} />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view with overflow', () => {
      const { container } = render(
        <AssetOverviewCard tokens={tokens} defiPositions={defiPositions} />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('NoTokens', () => {
    it('should match snapshot with no tokens', () => {
      const { container } = render(
        <AssetOverviewCard tokens={[]} defiPositions={defiPositions} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view with no tokens', () => {
      const { container } = render(
        <AssetOverviewCard tokens={[]} defiPositions={defiPositions} />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const { container } = render(
        <AssetOverviewCard tokens={[]} defiPositions={defiPositions} />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('NoDeFiPositions', () => {
    it('should match snapshot with no DeFi positions', () => {
      const { container } = render(
        <AssetOverviewCard tokens={tokens} defiPositions={[]} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view', () => {
      const { container } = render(
        <AssetOverviewCard tokens={tokens} defiPositions={[]} />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view with no positions', () => {
      const { container } = render(
        <AssetOverviewCard tokens={tokens} defiPositions={[]} />,
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
          defiPositions={defiPositions}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for Tokens view with tiny amounts', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokenTinyAmounts}
          defiPositions={defiPositions}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-tokens'));
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for DeFi Positions view', () => {
      const { container } = render(
        <AssetOverviewCard
          tokens={tokenTinyAmounts}
          defiPositions={defiPositions}
        />,
      );
      fireEvent.click(screen.getByTestId('asset-overview-nav-defiPositions'));
      expect(container).toMatchSnapshot();
    });
  });

  describe('NoContent', () => {
    it('should match snapshot with no content', () => {
      const { container } = render(
        <AssetOverviewCard tokens={[]} defiPositions={[]} />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Navigation Interactions', () => {
    it('should navigate between all views', () => {
      render(
        <AssetOverviewCard
          tokens={tokens.slice(0, 2)}
          defiPositions={defiPositions.slice(0, 2)}
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
        <AssetOverviewCard tokens={[]} defiPositions={[]} isLoading={true} />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});

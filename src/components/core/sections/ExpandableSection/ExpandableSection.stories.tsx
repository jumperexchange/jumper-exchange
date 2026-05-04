import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ExpandableSection } from './ExpandableSection';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  mockDaiBalance,
  mockMultiChainEthBalances,
  mockMultiChainUsdcBalances,
} from './fixtures';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { getUniqueChains } from '@/components/composite/BalanceCard/utils';
import { EntityStackBadgePlacement } from '@/components/composite/EntityStackWithBadge/types';
import { TokenAmount } from '@/components/composite/TokenAmount/TokenAmount';
import { AvatarSize } from '../../AvatarStack/AvatarStack.types';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';

type BalanceGroup = PortfolioBalance<WalletToken>[];

const TypedExpandableSection = ExpandableSection<BalanceGroup>;

const meta = {
  title: 'core/sections/ExpandableSection',
  component: TypedExpandableSection,
} satisfies Meta<typeof TypedExpandableSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultConfig = {
  titleVariant: 'bodyLargeStrong',
  descriptionVariant: 'bodyXSmall',
  tokenSize: AvatarSize.XXL,
  chainsSize: AvatarSize.SM,
  inlineChainsSize: AvatarSize.XS,
  chainsLimit: 8,
  chainsSpacing: -0.5,
  infoContainerGap: 0.5,
} as const;

const balanceGroups: BalanceGroup[] = [
  mockMultiChainEthBalances,
  mockMultiChainUsdcBalances,
  mockDaiBalance,
];

const renderBalanceGroup = (balances: BalanceGroup) => {
  const hasMultipleChains = balances.length > 1;
  const primaryBalance = balances[0]!;
  const chainEntities = getUniqueChains(balances);
  return (
    <>
      <EntityStackWithBadge
        disableBorder
        entities={[primaryBalance.token]}
        badgeEntities={chainEntities}
        placement={
          hasMultipleChains
            ? EntityStackBadgePlacement.Inline
            : EntityStackBadgePlacement.Overlay
        }
        size={defaultConfig.tokenSize}
        badgeSize={
          hasMultipleChains
            ? defaultConfig.inlineChainsSize
            : defaultConfig.chainsSize
        }
        content={{
          title: primaryBalance.token.symbol,
          titleVariant: defaultConfig.titleVariant,
          hintVariant: defaultConfig.descriptionVariant,
        }}
        spacing={{
          badge: defaultConfig.chainsSpacing,
          infoContainerGap: defaultConfig.infoContainerGap,
        }}
      />
      {hasMultipleChains ? (
        <TokenAmount
          balances={balances}
          amountUSDVariant={defaultConfig.titleVariant}
          amountVariant={defaultConfig.descriptionVariant}
          gap={defaultConfig.infoContainerGap}
          sx={{
            textAlign: 'right',
            marginLeft: 'auto',
            minWidth: 0,
          }}
        />
      ) : (
        <TokenAmount
          balance={primaryBalance}
          amountUSDVariant={defaultConfig.titleVariant}
          amountVariant={defaultConfig.descriptionVariant}
          gap={defaultConfig.infoContainerGap}
          sx={{
            textAlign: 'right',
            marginLeft: 'auto',
            minWidth: 0,
          }}
        />
      )}
    </>
  );
};

const commonArgs = {
  header: (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        width: '100%',
        gap: 2,
      }}
    >
      <Stack direction="row" sx={{ gap: 2 }}>
        <Typography variant={defaultConfig.titleVariant}>Tokens</Typography>
        <Typography variant={defaultConfig.titleVariant} color="textSecondary">
          64%
        </Typography>
      </Stack>
      <Typography variant={defaultConfig.titleVariant} sx={{ mr: 1 }}>
        $16,704
      </Typography>
    </Stack>
  ),
  items: balanceGroups,
  renderItem: renderBalanceGroup,
};

export const Default: Story = {
  args: commonArgs,
};

export const NonExpandable: Story = {
  args: {
    ...commonArgs,
    shouldExpand: false,
  },
};

export const HideExpandIcon: Story = {
  args: {
    ...commonArgs,
    showExpandIcon: false,
  },
};

export const NonClickableItems: Story = {
  args: {
    ...commonArgs,
    isDetailsItemClickable: false,
  },
};

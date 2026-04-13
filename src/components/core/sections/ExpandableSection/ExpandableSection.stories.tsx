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
import { StyledContent } from './ExpandableSection.style';
import { AvatarSize } from '../../AvatarStack/AvatarStack.types';

const meta = {
  title: 'core/sections/ExpandableSection',
  component: ExpandableSection,
} satisfies Meta<typeof ExpandableSection>;

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

export const Default: Story = {
  args: {
    renderHeader: () => {
      return (
        <Stack
          flexDirection="row"
          gap={2}
          justifyContent="space-between"
          width="100%"
        >
          <Stack flexDirection="row" gap={2}>
            <Typography variant={defaultConfig.titleVariant}>Tokens</Typography>
            <Typography
              variant={defaultConfig.titleVariant}
              color="textSecondary"
            >
              64%
            </Typography>
          </Stack>
          <Typography variant={defaultConfig.titleVariant} sx={{ mr: 1 }}>
            $16,704
          </Typography>
        </Stack>
      );
    },
    children: [
      mockMultiChainEthBalances,
      mockMultiChainUsdcBalances,
      mockDaiBalance,
    ].map((balances) => {
      const hasMultipleChains = balances.length > 1;
      const primaryBalance = balances[0]!;
      const chainEntities = getUniqueChains(balances);
      return (
        <StyledContent
          hideCursor={false}
          direction="row"
          spacing={2}
          useFlexGap
          justifyContent="space-between"
          alignItems="center"
        >
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
        </StyledContent>
      );
    }),
  },
};

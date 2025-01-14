import type { ExtendedChain, Token } from '@lifi/sdk';
import { AvatarBadgeNoMUI } from '../../AvatarBadge/NoMUI/AvatarBadgeNoMUI';
import { FieldSkeleton } from '../FieldSkeleton';
import type { ImageTheme } from '../ImageGeneration.types';

import { decimalFormatter } from 'src/utils/formatNumbers';
import {
  amountTextStyles,
  fieldContainerStyles,
  tokenTextStyles,
} from '../style';

const ReviewField = ({
  sx,
  token,
  chain,
  amount = 0,
  amountUSD,
  routeAmount,
  routeAmountUSD,
  highlighted,
  fullWidth,
  showSkeletons,
  theme,
}: {
  sx?: any;
  token?: Token | null;
  chain?: ExtendedChain | null;
  theme?: ImageTheme;
  amount?: number | null;
  amountUSD?: number | null;
  highlighted?: boolean | null;
  routeAmount?: number | null;
  routeAmountUSD?: number | null;
  extendedHeight?: boolean;
  fullWidth?: boolean;
  showSkeletons?: boolean;
}) => {
  const formatAmount = decimalFormatter('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });

  const containerWidth = fullWidth ? 368 : 174; // Width based on fullWidth prop
  const fieldContainerStyle = fieldContainerStyles();
  const tokenAmountTextStyle = tokenTextStyles('amount', theme);
  const tokenSymbolTextStyle = tokenTextStyles('symbol', theme);
  const amountTextStyle = amountTextStyles(theme);
  return (
    <div style={{ display: 'flex', width: containerWidth }}>
      <div
        style={{
          ...fieldContainerStyle,
          padding: '0px 16px',
          ...(highlighted && {
            boxShadow: `inset 0 0 0 2px ${theme === 'dark' ? '#653BA3' : '#31007A'}`,
          }),
          ...sx,
        }}
      >
        <div style={{ display: 'flex', width: '100%' }}>
          {token && chain && (
            <AvatarBadgeNoMUI
              avatarSize={40}
              avatarSrc={token.logoURI}
              badgeSize={16}
              badgeSrc={chain.logoURI}
              badgeOffset={{ x: 2, y: 2 }}
              badgeGap={4}
              theme={theme}
            />
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '16px',
            }}
          >
            <p style={amountTextStyle}>
              {formatAmount(routeAmount || amount || 0)}
            </p>
            {!showSkeletons && token ? (
              <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                <p
                  className="amount"
                  style={{
                    ...tokenAmountTextStyle,
                  }}
                >
                  ${(routeAmountUSD || amountUSD || amount || 0).toFixed(2)}
                </p>
                <p
                  style={{
                    ...tokenSymbolTextStyle,
                  }}
                >
                  {`${token.symbol} on ${chain?.name}`}
                </p>
              </div>
            ) : (
              <FieldSkeleton
                width={32}
                height={12}
                sx={{ marginTop: showSkeletons ? 0 : undefined }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewField;

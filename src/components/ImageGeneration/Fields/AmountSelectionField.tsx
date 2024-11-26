/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import { decimalFormatter } from 'src/utils/formatNumbers';
import { AvatarBadgeSSR } from '../../AvatarBadge/SSR/AvatarBadgeSSR';
import type { ImageTheme } from '../ImageGeneration.types';
import {
  amountContainerStyles,
  amountTextStyles,
  fieldContainerStyles,
  tokenTextStyles,
} from '../style';

const Field = ({
  sx,
  token,
  chain,
  amount = 0,
  theme,
  amountUSD,
  routeAmount,
  routeAmountUSD,
  highlighted,
  fullWidth,
  showSkeletons,
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
  fullWidth?: boolean;
  showSkeletons?: boolean;
}) => {
  // Function to calculate top offset based on conditions

  const formatAmount = decimalFormatter('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
  const fieldContainerStyle = fieldContainerStyles();
  const amountTextStyle = amountTextStyles(theme);
  const tokenTextStyle = tokenTextStyles('amount', theme);

  const amountContainerStyle = amountContainerStyles() as CSSProperties;
  return (
    <div style={{ display: 'flex', width: fullWidth ? 368 : 174 }}>
      <div
        style={{
          ...fieldContainerStyle,
          padding: `46px 16px 16px`,
          ...(highlighted && {
            boxShadow: `inset 0 0 0 2px ${theme === 'dark' ? '#653BA3' : '#31007A'}`,
          }),
          ...sx,
        }}
      >
        <div style={{ display: 'flex', width: '100%' }}>
          {token && chain && (
            <AvatarBadgeSSR
              avatarSize={40}
              avatarSrc={token?.logoURI}
              badgeSize={16}
              badgeSrc={chain?.logoURI}
              badgeOffset={{ x: 2, y: 2 }}
              badgeGap={4}
              theme={theme}
            />
          )}
          <div
            style={{
              ...amountContainerStyle,
              marginTop: 2,
              gap: 18,
            }}
          >
            <p style={amountTextStyle}>
              {formatAmount(routeAmount || amount || 0)}
            </p>
            {!showSkeletons && token && (
              <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                <p className="amount" style={tokenTextStyle}>
                  ${(routeAmountUSD || amountUSD || amount || 0).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Field;

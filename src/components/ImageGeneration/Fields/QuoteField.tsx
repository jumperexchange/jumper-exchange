/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import { decimalFormatter } from 'src/utils/formatNumbers';
import { AvatarBadgeSSR } from '../../AvatarBadge/SSR/AvatarBadgeSSR';
import { FieldSkeleton } from '../FieldSkeleton';
import type { ImageTheme } from '../ImageGeneration.types';
import {
  amountContainerStyles,
  amountTextStyles,
  fieldContainerStyles,
  tokenTextStyles,
} from '../style';

const QuoteField = ({
  sx,
  token,
  chain,
  amount = 0,
  extendedHeight,
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
  amount: number | null;
  amountUSD?: number | null;
  highlighted?: boolean | null;
  routeAmount?: number | null;
  routeAmountUSD?: number | null;
  extendedHeight?: boolean;
  fullWidth?: boolean;
  showSkeletons?: boolean;
}) => {
  // Function to calculate top offset based on conditions

  const formatAmount = decimalFormatter('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  });

  const fieldContainerStyle = fieldContainerStyles(extendedHeight);
  const tokenTextStyle = tokenTextStyles('amount', theme);
  const amountTextStyle = amountTextStyles(theme);
  const amountContainerStyle = amountContainerStyles() as CSSProperties;
  return (
    <div style={{ display: 'flex', width: fullWidth ? 368 : 174 }}>
      <div
        style={{
          ...fieldContainerStyle,
          padding: `${extendedHeight ? 56 : 16}px 16px 16px`,
          ...(highlighted && {
            boxShadow: `inset 0 0 0 2px ${theme === 'dark' ? '#653BA3' : '#31007A'}`,
          }),
          flexDirection: 'column',
          justifyContent: 'flex-start',
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
          <div style={amountContainerStyle}>
            <p style={amountTextStyle}>
              {formatAmount(routeAmount || amount || 0)}
            </p>
            {!showSkeletons && token ? (
              <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                <p className="amount" style={tokenTextStyle}>
                  ${(routeAmountUSD || amountUSD || amount || 0).toFixed(2)}
                </p>
              </div>
            ) : (
              <FieldSkeleton width={84} height={12} sx={{ marginTop: 4 }} />
            )}
          </div>
        </div>
        <FieldSkeleton width={164} height={12} sx={{ marginTop: 20 }} />
      </div>
    </div>
  );
};

export default QuoteField;

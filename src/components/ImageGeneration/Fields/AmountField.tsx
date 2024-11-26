/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import { decimalFormatter } from 'src/utils/formatNumbers';
import { AvatarBadgeSSR } from '../../AvatarBadge/SSR/AvatarBadgeSSR';
import type { ImageTheme } from '../ImageGeneration.types';
import { amountTextStyles } from '../style';

const AmountField = ({
  sx,
  token,
  chain,
  amount = 0,
  extendedHeight,
  theme,
  routeAmount,
  highlighted,
  fullWidth,
}: {
  sx?: CSSProperties;
  token?: Token | null;
  chain?: ExtendedChain | null;
  theme?: ImageTheme;
  amount?: number | null;
  highlighted?: boolean | null;
  routeAmount?: number | null;
  extendedHeight?: boolean;
  fullWidth?: boolean;
}) => {
  // Function to calculate top offset based on conditions

  const formatAmount = decimalFormatter('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });

  const amountTextStyle = amountTextStyles(theme);

  return (
    <div style={{ display: 'flex', width: fullWidth ? 368 : 174 }}>
      <div
        style={{
          display: 'flex',
          borderRadius: '12px',
          borderWidth: '1px',
          justifyContent: 'space-between',
          borderStyle: 'solid',
          height: extendedHeight ? 149.6 : 104,
          padding: `46px 16px 16px`,
          marginTop: '16px',
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
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '16px',
              width: '100%',
              marginTop: 8,
            }}
          >
            <p style={amountTextStyle}>
              {formatAmount(routeAmount || amount || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmountField;

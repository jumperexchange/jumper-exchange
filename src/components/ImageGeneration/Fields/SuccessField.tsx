/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import { decimalFormatter } from 'src/utils/formatNumbers';
import { AvatarBadgeNoMUI } from '../../AvatarBadge/NoMUI/AvatarBadgeNoMUI';
import { FieldSkeleton } from '../FieldSkeleton';
import type { ImageTheme } from '../ImageGeneration.types';
import {
  amountContainerStyles,
  amountTextStyles,
  fieldContainerStyles,
} from '../style';

const SuccessField = ({
  token,
  chain,
  amount = 0,
  extendedHeight,
  theme,
  routeAmount,
}: {
  token?: Token | null;
  chain?: ExtendedChain | null;
  theme?: ImageTheme;
  amount?: number | null;
  routeAmount?: number | null;
  extendedHeight?: boolean;
}) => {
  // Function to calculate top offset based on conditions

  const formatAmount = decimalFormatter('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });

  const fieldContainerStyle = fieldContainerStyles(extendedHeight);
  const amountTextStyle = amountTextStyles(theme);
  const amountContainerStyle = amountContainerStyles() as CSSProperties;

  return (
    <div style={{ display: 'flex', width: 174 }}>
      <div
        style={{
          ...fieldContainerStyle,
          height: extendedHeight ? 149.6 : 104,
          padding: '0px',
          marginTop: -2,
          marginLeft: 114,
        }}
      >
        <div style={{ display: 'flex', width: '100%' }}>
          {token && chain && (
            <AvatarBadgeNoMUI
              avatarSize={40}
              avatarSrc={token?.logoURI}
              badgeSize={16}
              badgeSrc={chain?.logoURI}
              badgeOffset={{ x: 2, y: 2 }}
              badgeGap={4}
              theme={theme}
            />
          )}
          <div style={{ ...amountContainerStyle, marginTop: 2 }}>
            <p style={amountTextStyle}>
              {formatAmount(routeAmount || amount || 0)}
            </p>
            <FieldSkeleton width={48} height={12} sx={{ marginTop: 2 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessField;

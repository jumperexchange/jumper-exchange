/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain, Token } from '@lifi/sdk';
import { AvatarBadgeNoMUI } from '../../AvatarBadge/NoMUI/AvatarBadgeNoMUI';
import { FieldSkeleton } from '../FieldSkeleton';
import type { ImageTheme } from '../ImageGeneration.types';
import { fieldContainerStyles } from '../style';

const TokenField = ({
  sx,
  token,
  chain,
  theme,
  highlighted,
  fullWidth,
}: {
  sx?: any;
  token?: Token | null;
  chain?: ExtendedChain | null;
  theme?: ImageTheme;
  highlighted?: boolean | null;
  fullWidth?: boolean;
}) => {
  // Function to calculate top offset based on conditions
  const fieldContainerStyle = fieldContainerStyles();
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
          <AvatarBadgeNoMUI
            avatarSize={40}
            avatarSrc={token?.logoURI}
            badgeSize={16}
            badgeSrc={chain?.logoURI}
            badgeOffset={{ x: 2, y: 2 }}
            badgeGap={4}
            theme={theme}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginLeft: '16px',
              marginTop: '2px',
            }}
          >
            {!!token?.symbol ? (
              <div
                style={{
                  display: 'flex',
                  height: '24px',
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                }}
              >
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: 'normal',
                    margin: 0,
                  }}
                >
                  {token?.symbol}
                </p>
              </div>
            ) : (
              <FieldSkeleton width={64} height={18} />
            )}
            {chain?.name ? (
              <div style={{ display: 'flex', height: '16px' }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: theme === 'dark' ? '#bbbbbb' : '#747474',
                    margin: 0,
                    letterSpacing: 'normal',
                  }}
                >
                  {chain?.name}
                </p>
              </div>
            ) : (
              <FieldSkeleton width={48} height={12} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenField;

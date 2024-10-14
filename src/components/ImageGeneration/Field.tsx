/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain, Token } from '@lifi/sdk';
import { AvatarBadgeSSR } from '../AvatarBadge/SSR/AvatarBadgeSSR';
import { FieldSkeleton } from './FieldSkeleton';
import type { ImageTheme } from './ImageGeneration.types';

function formatDecimal(n: number): string | number {
  // Check if the number is a whole number
  if (Number.isInteger(n)) {
    return n; // Return the number without decimals
  }

  // Convert to string to check the number of decimals
  const decimalPart = n.toString().split('.')[1];

  // If it has 2 or fewer decimal places, return it with 2 decimals
  if (decimalPart && decimalPart.length <= 2) {
    return n.toFixed(2);
  }

  // Otherwise, return the number rounded to 6 decimal places
  return n.toFixed(6);
}

const Field = ({
  sx,
  token,
  chain,
  type,
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
  sx?: any; //SxProps<Theme>;
  token?: Token | null;
  chain?: ExtendedChain | null;
  theme?: ImageTheme;
  type:
    | 'amount'
    | 'token'
    | 'quote'
    | 'review'
    | 'quote-amount'
    | 'amount-selection'
    | 'button'
    | 'title'
    | 'card-title'
    | 'success';
  amount?: number | null;
  amountUSD?: number | null;
  highlighted?: boolean | null;
  routeAmount?: number | null;
  routeAmountUSD?: number | null;
  extendedHeight?: boolean;
  fullWidth?: boolean;
  showSkeletons?: boolean;
}) => {
  // Function to calculate top offset based on conditions
  const getOffset = () => {
    if (type === 'amount') {
      return 46;
    }
    if (type === 'quote') {
      if (extendedHeight) {
        return 56;
      }
      return 16;
    } else {
      return 46;
    }
  };
  const getWidth = () => {
    if (type === 'quote') {
      return 315;
    } else if (fullWidth) {
      return 368;
    } else {
      return 174;
    }
  };

  const containerOffset = getOffset();
  const containerWidth = getWidth();

  return (
    <div style={{ display: 'flex', width: containerWidth }}>
      <div
        style={{
          display: 'flex',
          height: extendedHeight ? 149.6 : type === 'quote' ? 112 : 104,
          borderRadius: '12px',
          borderWidth: '1px',
          justifyContent: 'space-between',
          borderStyle: 'solid',
          // borderColor: '#E5E1EB',
          ...(highlighted && {
            boxShadow: `inset 0 0 0 2px ${theme === 'dark' ? '#653BA3' : '#31007A'}`,
          }),
          ...(type === 'quote' && {
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }),
          padding: `${containerOffset}px 16px 16px`,
          ...sx,
        }}
      >
        {type !== 'button' && (
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
            {type === 'token' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginLeft: '16px',
                  marginTop: '2px',
                }}
              >
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
              </div>
            )}
            {type !== 'token' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '16px',
                  width: '100%',
                  ...((type === 'quote-amount' ||
                    type === 'amount-selection') && { marginTop: 2, gap: 18 }),
                }}
              >
                <p
                  style={{
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1,
                    fontWeight: 600,
                    ...(type === 'review' && {
                      marginTop: 4,
                    }),
                  }}
                >
                  {formatDecimal(routeAmount || amount || 0)}
                </p>
                {!showSkeletons && token ? (
                  <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <p
                      className="amount"
                      style={{
                        color: theme === 'dark' ? '#ffffff' : '#747474',

                        margin: 0,
                        fontSize: 12,
                        fontWeight: 500,
                        marginTop: 10,
                        letterSpacing: '0.00938em',
                      }}
                    >
                      ${(routeAmountUSD || amountUSD || amount || 0).toFixed(2)}
                    </p>
                    {type === 'review' && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 500,
                          color:
                            theme === 'dark' ? 'rgb(187, 187, 187)' : '#747474',
                          marginLeft: 64,
                          marginTop: 10,
                          letterSpacing: '0.00938em',
                        }}
                      >
                        {`${token.symbol} on ${chain?.name}`}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {type === 'review' && (
                      <FieldSkeleton
                        width={150}
                        height={12}
                        sx={{ marginTop: 2 }}
                      />
                    )}
                    {type === 'success' && (
                      <FieldSkeleton
                        width={48}
                        height={12}
                        sx={{ marginTop: 2 }}
                      />
                    )}
                    {type === 'quote' && (
                      <FieldSkeleton
                        width={84}
                        height={12}
                        sx={{ marginTop: 4 }}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {type === 'quote' && (
          <FieldSkeleton width={164} height={12} sx={{ marginTop: 20 }} />
        )}
      </div>
    </div>
  );
};

export default Field;

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain, Token } from '@lifi/sdk';
import { AvatarBadgeSSR } from '../AvatarBadge/SSR/AvatarBadgeSSR';

const WidgetFieldSSR = ({
  sx,
  token,
  chain,
  type,
  amount = 0,
  extendedHeight,
  amountUSD,
  routeAmount,
  routeAmountUSD,
  highlighted,
  fullWidth,
}: {
  sx?: any; //SxProps<Theme>;
  token?: Token | null;
  chain?: ExtendedChain | null;
  type: 'amount' | 'token' | 'quote' | 'review';
  amount?: number | null;
  amountUSD?: number | null;
  highlighted?: boolean | null;
  routeAmount?: number | null;
  routeAmountUSD?: number | null;
  extendedHeight?: boolean;
  fullWidth?: boolean;
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

  console.log({ chain, token });
  return (
    <div style={{ display: 'flex', width: !fullWidth ? 174 : 368 }}>
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
            boxShadow: `inset 0 0 0 2px #31007A`,
          }),
          padding: `${getOffset()}px 16px 16px`,
          ...sx,
        }}
      >
        <div style={{ display: 'flex', width: '100%' }}>
          <AvatarBadgeSSR
            avatarSize={40}
            avatarSrc={token?.logoURI}
            badgeSize={16}
            badgeSrc={chain?.logoURI}
            badgeOffset={{ x: 2, y: 2 }}
            badgeGap={4}
          />
          {type === 'token' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginLeft: '16px',
                marginTop: '2px',
              }}
            >
              <div style={{ display: 'flex', height: '24px' }}>
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
                    color: '#747474',
                    margin: 0,
                    letterSpacing: 'normal',
                  }}
                >
                  {chain?.name}
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '16px',
                width: '100%',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 24,
                  lineHeight: 1,
                  fontWeight: 600,
                  ...(type === 'review' && {
                    marginTop: 4,
                  }),
                }}
              >
                {(routeAmount || amount || 0).toFixed(6)}
              </p>
              {token && (
                <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#747474',
                      marginTop: type === 'quote' ? 4 : 10,
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
                        color: '#747474',
                        marginLeft: 64,
                        marginTop: 10,
                        letterSpacing: '0.00938em',
                      }}
                    >
                      {`${token.symbol} on ${chain?.name}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetFieldSSR;

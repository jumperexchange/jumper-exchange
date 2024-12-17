/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain } from '@lifi/sdk';
import type { ImageTheme } from '../ImageGeneration.types';
import { fieldContainerStyles } from '../style';

const ChainImages = ({
  sx,
  chains,
  amount = 0,
  highlighted,
  theme,
}: {
  sx?: any;
  chains?: (ExtendedChain | undefined)[] | undefined;
  theme?: ImageTheme;
  amount?: number | null;
  highlighted?: boolean | null;
}) => {
  const fieldContainerStyle = fieldContainerStyles();

  return (
    <div style={{ display: 'flex', width: 552 }}>
      <div
        style={{
          ...fieldContainerStyle,
          // padding: '0px 16px',
          ...(highlighted && {
            boxShadow: `inset 0 0 0 2px ${theme === 'dark' ? '#653BA3' : '#31007A'}`,
          }),
          ...sx,
        }}
      >
        <div style={{ display: 'flex', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 63,
              gap: 12,
              width: 368,
            }}
          >
            {chains?.map((chain, index) =>
              chain?.logoURI && index < 9 ? (
                <div
                  style={{
                    display: 'flex',
                    width: 64,
                    height: 56,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={chain.logoURI}
                    alt={`${chain.name}-logo`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                    }}
                  />
                </div>
              ) : null,
            )}
            <div
              style={{
                display: 'flex',
                width: 64,
                height: 56,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                +{chains && chains?.length - 9}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainImages;

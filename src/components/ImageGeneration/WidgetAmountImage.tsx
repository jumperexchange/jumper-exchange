/* eslint-disable @next/next/no-img-element */
import type { ExtendedChain, Token } from '@lifi/sdk';
import type { CSSProperties } from 'react';
import { decimalFormatter } from 'src/utils/formatNumbers';
import ChainImages from './Fields/ChainImages';
import type { HighlightedAreas, ImageTheme } from './ImageGeneration.types';
import {
  contentContainerStyles,
  contentPositioningStyles,
  normalizeParagraph,
  pageStyles,
} from './style';

const SCALING_FACTOR = 2;

interface WidgetAmountsImageProps {
  chains?: (ExtendedChain | undefined)[];
  theme?: ImageTheme;
  amount?: string | null;
  width: number;
  tokens?: Token[];
  height: number;
  highlighted?: HighlightedAreas;
}

const WidgetAmountsImage = ({
  theme,
  chains,
  amount,
  width,
  tokens,
  height,
  highlighted,
}: WidgetAmountsImageProps) => {
  const contentContainerStyle = contentContainerStyles({
    height,
    width,
    scalingFactor: SCALING_FACTOR,
  }) as CSSProperties;

  const formatAmount = decimalFormatter('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const contentPositioningStyle = contentPositioningStyles() as CSSProperties;
  const normalizeParagraphStyle = normalizeParagraph() as CSSProperties;
  const pageStyle = pageStyles() as CSSProperties;
  return (
    <div style={contentPositioningStyle}>
      <div style={contentContainerStyle}>
        {
          // pages container -->
        }
        <div style={pageStyle}>
          <ChainImages
            theme={theme}
            amount={amount ? parseFloat(amount) : null}
            highlighted={highlighted === 'from'}
            chains={chains}
            sx={{ marginTop: 0 }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 176,
              gap: 20,
            }}
          >
            {tokens?.map((token, index) => (
              <div
                key={`token-${token.address}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: 368,
                }}
              >
                {/*
                  left column: token logo + symbol + name
                */}
                <div style={{ display: 'flex', height: 44 }}>
                  <img
                    src={token.logoURI}
                    alt={`${token.name}-logo`}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      marginLeft: 14,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 18,
                        height: 20,
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                        ...normalizeParagraphStyle,
                      }}
                    >
                      {token.symbol}
                    </p>
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: 12,
                        lineHeight: '16px',
                        height: 18,
                        color: theme === 'dark' ? '#bbbbbb' : '#747474',
                        ...normalizeParagraphStyle,
                      }}
                    >
                      {token.name}
                    </p>
                  </div>
                </div>
                {/*
                  right column: token amount + value
                */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 44,
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      height: '26px',
                      alignSelf: 'flex-end',
                      letterSpacing: '0.15008px',
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                      margin: 0,
                      // lineHeight: '24px',
                      ...normalizeParagraph,
                    }}
                  >
                    {((100 - index) / 100) * parseFloat(amount || '1')}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      height: '18px',
                      letterSpacing: '0.15008px',
                      margin: 0,
                      color: theme === 'dark' ? '#bbbbbb' : '#747474',
                      // lineHeight: '18px',
                      ...normalizeParagraph,
                    }}
                  >
                    $
                    {token &&
                      formatAmount(
                        ((100 - index) / 100) *
                          (parseFloat(token.priceUSD) *
                            parseFloat(amount || '1')),
                      )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default WidgetAmountsImage;

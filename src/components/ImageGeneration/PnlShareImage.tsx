/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import { JUMPER_URL } from '@/const/urls';
import {
  formatAmountWon,
  formatSwapSize,
} from '@/utils/image-generation/pnlShareCard';
import type { PnlShareParams } from '@/utils/image-generation/pnlShareSchema';

interface PnlShareImageProps extends PnlShareParams {
  width: number;
  height: number;
  /** Origin used to resolve the static card assets (logo, background). */
  origin?: string;
}

const WIN_COLOR = '#00FF65';
const BASE_COLOR = '#120B1E';
const FONT_FAMILY = 'Urbanist';

const PnlShareImage = ({
  amountWon,
  swapSize,
  fromToken,
  toToken,
  width,
  height,
  origin = JUMPER_URL,
}: PnlShareImageProps) => {
  const assetOrigin = origin.replace(/\/+$/, '');

  const containerStyle: CSSProperties = {
    display: 'flex',
    position: 'relative',
    width,
    height,
    overflow: 'hidden',
    borderRadius: 40,
    border: '2px solid rgba(178, 102, 255, 0.14)',
    background: `radial-gradient(55% 45% at 68% 72%, rgba(160, 55, 235, 0.55) 0%, rgba(18, 11, 30, 0) 62%), radial-gradient(48% 40% at 38% 102%, rgba(126, 34, 196, 0.5) 0%, rgba(18, 11, 30, 0) 70%), ${BASE_COLOR}`,
    fontFamily: FONT_FAMILY,
  };

  return (
    <div style={containerStyle}>
      {/* Background 3D crystal mark */}
      <img
        src={`${assetOrigin}/social-card/background.png`}
        alt=""
        style={{
          position: 'absolute',
          left: -371,
          top: -52,
          width: 2548,
          height: 1433,
        }}
      />

      {/* Jumper logo */}
      <img
        src={`${assetOrigin}/social-card/jumper-logo.png`}
        alt="Jumper"
        style={{
          position: 'absolute',
          left: 82,
          top: 72,
          width: 285,
          height: 58,
        }}
      />

      {/* Content anchored bottom-left */}
      <div
        style={{
          position: 'absolute',
          left: 82,
          bottom: 83,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 45,
        }}
      >
        <span
          style={{
            display: 'flex',
            width: 488,
            fontSize: 80,
            fontWeight: 600,
            lineHeight: 1.05,
            color: '#FFFFFF',
          }}
        >
          Extra output on this swap
        </span>

        <div
          style={{
            display: 'flex',
            width: 78,
            height: 2,
            background: 'rgba(255, 255, 255, 0.4)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 50 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                display: 'flex',
                fontSize: 181,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: -7.24,
                color: WIN_COLOR,
              }}
            >
              {formatAmountWon(amountWon)}
            </span>
            <div
              style={{
                display: 'flex',
                gap: 24,
                fontSize: 64,
                fontWeight: 400,
                color: '#FFFFFF',
              }}
            >
              <span style={{ display: 'flex' }}>on a</span>
              <span style={{ display: 'flex' }}>
                {formatSwapSize(swapSize)}
              </span>
              <span style={{ display: 'flex' }}>swap</span>
            </div>
          </div>

          <div style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px 40px',
                borderRadius: 200,
                border: '2px solid #FFFFFF',
                background: 'rgba(255, 255, 255, 0.12)',
                fontSize: 34,
                fontWeight: 500,
                color: '#FFFFFF',
              }}
            >
              {`${fromToken} → ${toToken}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PnlShareImage;

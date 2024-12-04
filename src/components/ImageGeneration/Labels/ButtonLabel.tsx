/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from 'react';
import type { ImageTheme } from '../ImageGeneration.types';

const ButtonLabel = ({
  sx,
  buttonLabel,
  theme,
  fullWidth,
}: {
  sx?: CSSProperties;
  theme?: ImageTheme;
  buttonLabel?: string;
  fullWidth?: boolean;
}) => {
  return (
    !!buttonLabel && (
      <div
        style={{
          display: 'flex',
          margin: 'auto',
          ...(fullWidth && { width: 140 }),
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            color: theme === 'dark' ? '#ffffff' : '#ffffff',
            margin: 0,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: 1,
            fontWeight: 600,
            ...sx,
          }}
        >
          {buttonLabel}
        </p>
      </div>
    )
  );
};

export default ButtonLabel;

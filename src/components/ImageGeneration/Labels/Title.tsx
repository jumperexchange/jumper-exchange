/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from 'react';
import type { ImageTheme } from '../ImageGeneration.types';

const Title = ({
  sx,
  title,
  theme,
  fullWidth,
}: {
  sx?: CSSProperties;
  theme?: ImageTheme;
  title: string;
  fullWidth?: boolean;
}) => {
  return (
    <>
      {!!title && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: !fullWidth ? 174 : 368,
          }}
        >
          <p
            style={{
              color: theme === 'dark' ? '#ffffff' : '#000000',
              fontSize: 18,
              lineHeight: 1.5,
              fontWeight: 700,
              ...sx,
            }}
          >
            {title}
          </p>
        </div>
      )}
    </>
  );
};

export default Title;

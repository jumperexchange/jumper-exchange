/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from 'react';
import type { ImageTheme } from '../ImageGeneration.types';

const CardTitle = ({
  sx,
  cardTitle,
  theme,
}: {
  sx?: CSSProperties;
  cardTitle?: string;
  theme?: ImageTheme;
}) => {
  return (
    !!cardTitle && (
      <p
        style={{
          color: theme === 'dark' ? '#ffffff' : '#000000',
          fontSize: 14,
          lineHeight: 1,
          fontWeight: 700,
          padding: '2px 17px',
          ...sx,
        }}
      >
        {cardTitle}
      </p>
    )
  );
};

export default CardTitle;

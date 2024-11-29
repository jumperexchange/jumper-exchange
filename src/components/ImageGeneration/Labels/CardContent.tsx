/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from 'react';
import type { ImageTheme } from '../ImageGeneration.types';

const CardContent = ({
  sx,
  cardContent,
  theme,
}: {
  sx?: CSSProperties;
  cardContent?: string;
  theme?: ImageTheme;
}) => {
  return (
    !!cardContent && (
      <p
        style={{
          color: theme === 'dark' ? '#ffffff' : '#000000',
          fontSize: 14,
          lineHeight: 1,
          fontWeight: 500,
          padding: '8px 72px',
          ...sx,
        }}
      >
        {cardContent}
      </p>
    )
  );
};

export default CardContent;

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import type { ImageTheme } from './ImageGeneration.types';

const Label = ({
  sx,
  buttonLabel,
  cardTitle,
  cardContent,
  title,
  theme,
  fullWidth,
}: {
  sx?: any; //SxProps<Theme>;
  cardTitle?: string;
  cardContent?: string;
  theme?: ImageTheme;
  buttonLabel?: string;
  title?: string;
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
      {!!cardTitle && (
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
      )}
      {!!cardContent && (
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
      )}
      {!!buttonLabel && (
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
      )}
    </>
  );
};

export default Label;

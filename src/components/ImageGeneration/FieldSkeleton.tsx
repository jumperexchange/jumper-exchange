/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';

export const FieldSkeleton = ({
  width,
  height,
  sx,
}: {
  width: number;
  height: number;
  sx?: CSSProperties;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        width,
        height,
        borderRadius: height,
        backgroundColor: '#74747454',
        ...(sx ? sx : {}),
      }}
    ></div>
  );
};

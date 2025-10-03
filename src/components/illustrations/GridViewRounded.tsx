import { SxProps, Theme } from '@mui/material/styles';
import * as React from 'react';

interface GridViewRoundedProps {
  sx?: SxProps<Theme>;
}

const GridViewRounded = (props: GridViewRoundedProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeOpacity={0.92}
      strokeWidth={2}
      d="M4.583 12.917H8.25c.456 0 .833.377.833.833v3.667a.838.838 0 0 1-.833.833H4.583a.839.839 0 0 1-.833-.833V13.75c0-.456.377-.833.833-.833Zm9.167 0h3.667c.456 0 .833.377.833.833v3.667a.839.839 0 0 1-.833.833H13.75a.839.839 0 0 1-.833-.833V13.75c0-.456.377-.833.833-.833ZM4.583 3.75H8.25c.456 0 .833.377.833.833V8.25a.838.838 0 0 1-.833.833H4.583a.838.838 0 0 1-.833-.833V4.583c0-.456.377-.833.833-.833Zm9.167 0h3.667c.456 0 .833.377.833.833V8.25a.838.838 0 0 1-.833.833H13.75a.838.838 0 0 1-.833-.833V4.583c0-.456.377-.833.833-.833Z"
    />
  </svg>
);
export default GridViewRounded;

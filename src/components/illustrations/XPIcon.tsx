import SvgIcon from '@mui/material/SvgIcon/SvgIcon';
import type { CSSProperties } from 'react';

export const XPIcon = ({
  color = '#31007A',
  sx,
}: {
  color?: string;
  sx?: CSSProperties;
}) => {
  return (
    <SvgIcon
      sx={{
        width: 20,
        height: 20,
        color,
        ...sx,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="10" fill="currentColor" />
        <path
          d="M5.18696 7.68696C4.94289 7.93104 4.94289 8.32677 5.18696 8.57085L6.62298 10.0069L5.18696 11.4429C4.94289 11.687 4.94289 12.0827 5.18696 12.3268C5.43104 12.5708 5.82677 12.5708 6.07085 12.3268L7.50686 10.8907L8.94286 12.3267C9.18694 12.5708 9.58267 12.5708 9.82674 12.3267C10.0708 12.0827 10.0708 11.6869 9.82674 11.4429L8.39075 10.0069L9.82674 8.57087C10.0708 8.32679 10.0708 7.93106 9.82674 7.68698C9.58267 7.4429 9.18694 7.4429 8.94286 7.68698L7.50686 9.12298L6.07085 7.68696C5.82677 7.44289 5.43104 7.44289 5.18696 7.68696Z"
          fill="white"
        />
        <path
          d="M10.625 11.25H11.875V12.5H11.25C10.9375 12.5 10.625 12.1875 10.625 11.875V11.25Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.25 7.5C10.9375 7.5 10.625 7.8125 10.625 8.125V11.25H13.75C15 11.25 15.625 10.3125 15.625 9.375C15.625 8.4375 15 7.5 13.75 7.5H11.25ZM13.75 8.75H11.875V10H13.75C14.2188 10 14.375 9.60512 14.375 9.375C14.375 9.14488 14.2188 8.75 13.75 8.75Z"
          fill="white"
        />
      </svg>
    </SvgIcon>
  );
};

interface SuperfestXPIconProps {
  size?: number;
}

export const SuperfestXPIcon = ({ size }: SuperfestXPIconProps) => {
  return (
    <SvgIcon
      sx={{
        width: size ?? 32,
        height: size ?? 32,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={`0 0 ${size} ${size}`}
      >
        <g clipPath="url(#a)">
          <circle cx="16" cy="16" r="16" fill={'#ffffff'} />
          <path
            fill={'#31007A'}
            d="M6.374 11.374a1.25 1.25 0 0 0 0 1.768l2.872 2.872-2.872 2.872a1.25 1.25 0 0 0 1.768 1.767l2.872-2.872 2.872 2.872a1.25 1.25 0 0 0 1.767-1.767l-2.872-2.872 2.872-2.872a1.25 1.25 0 0 0-1.767-1.768l-2.872 2.872-2.872-2.872a1.25 1.25 0 0 0-1.768 0ZM18 18.5h2.5V21h-1.25c-.625 0-1.25-.625-1.25-1.25V18.5Z"
          />
          <path
            fill={'#31007A'}
            fillRule="evenodd"
            d="M19.25 11c-.625 0-1.25.625-1.25 1.25v6.25h6.25c2.5 0 3.75-1.875 3.75-3.75S26.75 11 24.25 11h-5Zm5 2.5H20.5V16h3.75c.938 0 1.25-.79 1.25-1.25 0-.46-.313-1.25-1.25-1.25Z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h32v32H0z" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
};

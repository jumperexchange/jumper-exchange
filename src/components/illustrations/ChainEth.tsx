import type { JSX, SVGProps } from 'react';

export const ChainEth = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      style={{
        fill: '#40477a',
        fillOpacity: 1,
        stroke: '#fff',
        strokeWidth: 0,
        strokeLinecap: 'square',
        strokeLinejoin: 'round',
      }}
      cx={11}
      cy={11}
      r={11}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.5 12.003 11 17.97v-3.35z"
      fill="#c8b2f5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 12.003 11 17.97v-3.35z"
      fill="#eecbc0"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m6.5 11.311 4.5-2v4.56z"
      fill="#87a9f0"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m15.5 11.311-4.5-2v4.56z"
      fill="#cab3f5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 11.311 11 4.25v5.06z"
      fill="#eecbc0"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m15.499 11.311-4.5-7.061v5.06z"
      fill="#b8fbf6"
    />
  </svg>
);

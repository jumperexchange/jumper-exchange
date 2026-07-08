import { SvgIcon, type SvgIconProps } from '@mui/material';

export const CandlestickChartIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    {/* Nesting a raw <svg> makes SvgIcon skip its default `fill: currentColor`
    override, which otherwise gets inherited by these unfilled shapes. */}
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5v4" />
      <rect width="4" height="6" x="7" y="9" rx="1" />
      <path d="M9 15v2" />
      <path d="M17 3v2" />
      <rect width="4" height="8" x="15" y="5" rx="1" />
      <path d="M17 13v3" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    </svg>
  </SvgIcon>
);

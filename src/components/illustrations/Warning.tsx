import * as React from 'react';
export const Warning = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={96}
    height={96}
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={48} cy={48} r={48} fill="#FFF7D6" />
    <path
      d="M32.94 66h30.12c3.08 0 5-3.34 3.46-6L51.46 33.98c-1.54-2.66-5.38-2.66-6.92 0L29.48 60c-1.54 2.66.38 6 3.46 6zM48 52c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2s2 .9 2 2v4c0 1.1-.9 2-2 2zm2 8h-4v-4h4v4z"
      fill="#D6AB00"
    />
  </svg>
);

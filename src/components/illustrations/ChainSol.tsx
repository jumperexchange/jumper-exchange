import * as React from 'react';
export const ChainSol = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        x1={9.013}
        y1={19.455}
        x2={18.573}
        y2={8.392}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-3 -3)"
      >
        <stop offset={0.08} stopColor="#9945FF" />
        <stop offset={0.3} stopColor="#8752F3" />
        <stop offset={0.5} stopColor="#5497D5" />
        <stop offset={0.6} stopColor="#43B4CA" />
        <stop offset={0.72} stopColor="#28E0B9" />
        <stop offset={0.97} stopColor="#19FB9B" />
      </linearGradient>
    </defs>
    <circle
      style={{
        opacity: 1,
        fill: '#000',
        fillOpacity: 1,
        stroke: '#fff',
        strokeWidth: 0,
        strokeLinecap: 'square',
        strokeLinejoin: 'round',
        strokeDasharray: 'none',
        strokeOpacity: 1,
      }}
      cx={11}
      cy={11}
      r={11}
    />
    <path
      d="m16.938 13.993-1.98 2.07a.459.459 0 0 1-.337.142H5.23a.234.234 0 0 1-.21-.134.219.219 0 0 1 .042-.243l1.982-2.07a.459.459 0 0 1 .336-.141h9.39a.234.234 0 0 1 .211.134.22.22 0 0 1-.043.242zm-1.98-4.167a.46.46 0 0 0-.337-.143H5.23a.235.235 0 0 0-.126.037.219.219 0 0 0-.042.34l1.982 2.07a.459.459 0 0 0 .336.142h9.39a.235.235 0 0 0 .126-.037.22.22 0 0 0 .042-.34zM5.23 8.339h9.39a.471.471 0 0 0 .337-.142l1.981-2.07a.222.222 0 0 0 .043-.242.234.234 0 0 0-.211-.135H7.38a.47.47 0 0 0-.336.142l-1.982 2.07a.222.222 0 0 0-.043.242.235.235 0 0 0 .21.135z"
      fill="url(#a)"
      style={{
        fill: 'url(#a)',
      }}
    />
  </svg>
);

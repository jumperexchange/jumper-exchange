import React from 'react';

import type { ReactElement } from 'react';

export function IconInfo(props: React.SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      width={'24'}
      height={'24'}
      viewBox={'0 0 24 24'}
      fill={'none'}
      xmlns={'http://www.w3.org/2000/svg'}
    >
      <path
        d={
          'M2.25539 8.35992C2.58904 4.20322 6.05968 1 10.2297 1H15.3321C20.0028 1 23.6802 4.98442 23.3065 9.64008L22.7446 16.6401C22.411 20.7968 18.9403 24 14.7703 24H9.66787C4.99723 24 1.31982 20.0156 1.69352 15.3599L2.25539 8.35992Z'
        }
        fill={props.color || 'currentcolor'}
      />
      <path
        d={
          'M1.32924 6.43993C1.62118 2.80281 4.65799 0 8.3068 0H15.4156C19.5024 0 22.7202 3.48636 22.3932 7.56007L21.6708 16.5601C21.3788 20.1972 18.342 23 14.6932 23H7.58438C3.49757 23 0.279842 19.5136 0.606828 15.4399L1.32924 6.43993Z'
        }
        fill={'currentcolor'}
      />
      <circle cx={'11.5'} cy={'5.5'} r={'1.5'} fill={'white'} />
      <path
        d={
          'M10 10.5C10 9.67157 10.6716 9 11.5 9C12.3284 9 13 9.67157 13 10.5V17.5C13 18.3284 12.3284 19 11.5 19C10.6716 19 10 18.3284 10 17.5V10.5Z'
        }
        fill={'white'}
      />
    </svg>
  );
}

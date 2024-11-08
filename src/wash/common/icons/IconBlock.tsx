import React from 'react';

import type { ReactElement } from 'react';

export function IconBlock(props: React.SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      width={'16'}
      height={'20'}
      viewBox={'0 0 16 20'}
      fill={'none'}
      xmlns={'http://www.w3.org/2000/svg'}
    >
      <circle
        cx={'8'}
        cy={'10'}
        r={'6'}
        stroke={'white'}
        strokeWidth={'2'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <rect
        x={'11.8896'}
        y={'4.69531'}
        width={'2'}
        height={'13'}
        transform={'rotate(45 11.8896 4.69531)'}
        fill={'currentcolor'}
      />
    </svg>
  );
}

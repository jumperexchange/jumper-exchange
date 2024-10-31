import React from 'react';

import type { ReactElement } from 'react';

export function IconArrowLeft(
  props: React.SVGProps<SVGSVGElement>,
): ReactElement {
  return (
    <svg
      {...props}
      width={'12'}
      height={'12'}
      viewBox={'0 0 12 12'}
      fill={'none'}
      xmlns={'http://www.w3.org/2000/svg'}
    >
      <path
        d={'M7 10L11 6L7 2'}
        stroke={'white'}
        strokeWidth={'2'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M10 6H1'}
        stroke={'white'}
        strokeWidth={'2'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
}

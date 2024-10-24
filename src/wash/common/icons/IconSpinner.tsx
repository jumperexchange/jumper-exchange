import React from 'react';

import type { ReactElement } from 'react';

export function IconSpinner(
  props: React.SVGProps<SVGSVGElement>,
): ReactElement {
  return (
    <svg
      {...props}
      width={'18'}
      height={'18'}
      viewBox={'0 0 18 18'}
      fill={'none'}
      xmlns={'http://www.w3.org/2000/svg'}
    >
      <path
        d={
          'M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1'
        }
        stroke={'currentColor'}
        strokeWidth={'2'}
        strokeLinecap={'round'}
      />
    </svg>
  );
}

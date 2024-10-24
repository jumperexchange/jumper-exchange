import React from 'react';

import type { ReactElement } from 'react';

export function IconDone(props: React.SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      width={'27'}
      height={'20'}
      viewBox={'0 0 27 20'}
      fill={'none'}
      xmlns={'http://www.w3.org/2000/svg'}
    >
      <path
        d={
          'M2.24605 8.16252C2.67464 4.09095 6.10803 1 10.2021 1H18.1137C22.8633 1 26.567 5.11397 26.0697 9.83748L25.754 12.8375C25.3254 16.9091 21.892 20 17.7979 20H9.8863C5.1367 20 1.43305 15.886 1.93026 11.1625L2.24605 8.16252Z'
        }
        fill={'#8000FF'}
      />
      <path
        d={
          'M1.34029 6.2672C1.71531 2.70458 4.71952 0 8.30183 0H18.2245C22.3804 0 25.6211 3.59972 25.186 7.73279L24.6597 12.7328C24.2847 16.2954 21.2805 19 17.6982 19H7.77552C3.61961 19 0.378918 15.4003 0.813978 11.2672L1.34029 6.2672Z'
        }
        fill={'#28065F'}
      />
      <path
        d={'M9 8.8L12.6 13L18 6'}
        stroke={'white'}
        strokeWidth={'3'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
}

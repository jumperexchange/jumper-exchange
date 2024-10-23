import styled from '@emotion/styled';
import { cl } from '../utils/utils';

import type { ReactElement } from 'react';
import { mq } from '../utils/constants';

/**********************************************************************************************
 * RaysBackground renders a background with rays that spin. This is used when we need a
 * full-screen background with rays
 *********************************************************************************************/
export function RaysBackground({
  className,
}: {
  className?: string;
}): ReactElement {
  return (
    <div
      className={cl(
        'absolute top-[-2900px] left-1/2 -z-10 -translate-x-1/2 ',
        className,
      )}
    >
      <div className={'absolute left-0 top-0 -z-30 size-full bg-violet-100'} />
      <svg
        className={'z-0'}
        style={{ animation: 'spin 40s linear infinite' }}
        width={'6000'}
        height={'6000'}
        viewBox={'0 0 1920 1066'}
        fill={'none'}
        xmlns={'http://www.w3.org/2000/svg'}
      >
        <path d={'M960 533L743.19 0H832.299L960 533Z'} fill={'#28065F'} />
        <path d={'M960 533L532.929 0H643.905L960 533Z'} fill={'#28065F'} />
        <path d={'M960 533L231.125 0H398.037L960 533Z'} fill={'#28065F'} />
        <path d={'M960 533L0 138.118V0H0.917333L960 533Z'} fill={'#28065F'} />
        <path d={'M960 533L0 373.473V262.147L960 533Z'} fill={'#28065F'} />
        <path d={'M960 533L0 584.914V481.086L960 533Z'} fill={'#28065F'} />
        <path d={'M960 533L0 803.853V692.527L960 533Z'} fill={'#28065F'} />
        <path
          d={'M960 533L0.917333 1066H0V927.864L960 533Z'}
          fill={'#28065F'}
        />
        <path d={'M960 533L398.037 1066H231.125L960 533Z'} fill={'#28065F'} />
        <path
          d={'M960.001 533L643.905 1066H532.929L960.001 533Z'}
          fill={'#28065F'}
        />
        <path d={'M960 533L832.299 1066H743.19L960 533Z'} fill={'#28065F'} />
        <path
          d={'M1001.56 1066H918.442L959.999 533L1001.56 1066Z'}
          fill={'#28065F'}
        />
        <path
          d={'M1176.81 1066H1087.7L960 533L1176.81 1066Z'}
          fill={'#28065F'}
        />
        <path
          d={'M1387.07 1066H1276.1L960 533L1387.07 1066Z'}
          fill={'#28065F'}
        />
        <path
          d={'M1688.87 1066H1521.94L960 533L1688.87 1066Z'}
          fill={'#28065F'}
        />
        <path
          d={'M1920 927.864V1066H1919.08L960 533L1920 927.864Z'}
          fill={'#28065F'}
        />
        <path
          d={'M1920 692.527V803.853L960 533L1920 692.527Z'}
          fill={'#28065F'}
        />
        <path
          d={'M1920 481.086V584.914L960 533L1920 481.086Z'}
          fill={'#28065F'}
        />
        <path
          d={'M1920 262.147V373.473L960 533L1920 262.147Z'}
          fill={'#28065F'}
        />
        <path d={'M1920 0V138.118L960 533L1919.08 0H1920Z'} fill={'#28065F'} />
        <path d={'M1688.87 0L960 533L1521.94 0H1688.87Z'} fill={'#28065F'} />
        <path d={'M1387.07 0L960 533L1276.1 0H1387.07Z'} fill={'#28065F'} />
        <path d={'M1176.81 0L960 533L1087.7 0H1176.81Z'} fill={'#28065F'} />
        <path
          d={'M1001.56 0L959.999 533L918.442 0H1001.56Z'}
          fill={'#28065F'}
        />
      </svg>
    </div>
  );
}

const RaysWrapper = styled.div`
  position: absolute;
  left: -1100px;
  top: 180px;
  transform: translateY(-50%);
  overflow: hidden;
  ${mq[0]} {
    left: -1030px;
  }
`;

/**********************************************************************************************
 * RevealRaysBackground renders a background with rays that spin. This specific variant is
 * to highlight the fact that the NFT can be revealed and is used in the CurrentNFTBlock
 * component
 *********************************************************************************************/
export function RevealRaysBackground(): ReactElement {
  return (
    <div
      className={
        'absolute left-0 top-0 size-full overflow-hidden rounded-[32px]'
      }
    >
      <RaysWrapper>
        <svg
          style={{ animation: 'spin 70s linear infinite' }}
          width={'2500'}
          height={'2500'}
          viewBox={'0 0 1920 1066'}
          fill={'none'}
          xmlns={'http://www.w3.org/2000/svg'}
        >
          <path d={'M960 533L743.19 0H832.299L960 533Z'} fill={'#28065F'} />
          <path d={'M960 533L532.929 0H643.905L960 533Z'} fill={'#28065F'} />
          <path d={'M960 533L231.125 0H398.037L960 533Z'} fill={'#28065F'} />
          <path d={'M960 533L0 138.118V0H0.917333L960 533Z'} fill={'#28065F'} />
          <path d={'M960 533L0 373.473V262.147L960 533Z'} fill={'#28065F'} />
          <path d={'M960 533L0 584.914V481.086L960 533Z'} fill={'#28065F'} />
          <path d={'M960 533L0 803.853V692.527L960 533Z'} fill={'#28065F'} />
          <path
            d={'M960 533L0.917333 1066H0V927.864L960 533Z'}
            fill={'#28065F'}
          />
          <path d={'M960 533L398.037 1066H231.125L960 533Z'} fill={'#28065F'} />
          <path
            d={'M960.001 533L643.905 1066H532.929L960.001 533Z'}
            fill={'#28065F'}
          />
          <path d={'M960 533L832.299 1066H743.19L960 533Z'} fill={'#28065F'} />
          <path
            d={'M1001.56 1066H918.442L959.999 533L1001.56 1066Z'}
            fill={'#28065F'}
          />
          <path
            d={'M1176.81 1066H1087.7L960 533L1176.81 1066Z'}
            fill={'#28065F'}
          />
          <path
            d={'M1387.07 1066H1276.1L960 533L1387.07 1066Z'}
            fill={'#28065F'}
          />
          <path
            d={'M1688.87 1066H1521.94L960 533L1688.87 1066Z'}
            fill={'#28065F'}
          />
          <path
            d={'M1920 927.864V1066H1919.08L960 533L1920 927.864Z'}
            fill={'#28065F'}
          />
          <path
            d={'M1920 692.527V803.853L960 533L1920 692.527Z'}
            fill={'#28065F'}
          />
          <path
            d={'M1920 481.086V584.914L960 533L1920 481.086Z'}
            fill={'#28065F'}
          />
          <path
            d={'M1920 262.147V373.473L960 533L1920 262.147Z'}
            fill={'#28065F'}
          />
          <path
            d={'M1920 0V138.118L960 533L1919.08 0H1920Z'}
            fill={'#28065F'}
          />
          <path d={'M1688.87 0L960 533L1521.94 0H1688.87Z'} fill={'#28065F'} />
          <path d={'M1387.07 0L960 533L1276.1 0H1387.07Z'} fill={'#28065F'} />
          <path d={'M1176.81 0L960 533L1087.7 0H1176.81Z'} fill={'#28065F'} />
          <path
            d={'M1001.56 0L959.999 533L918.442 0H1001.56Z'}
            fill={'#28065F'}
          />
        </svg>
      </RaysWrapper>
    </div>
  );
}

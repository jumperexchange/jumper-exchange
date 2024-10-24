'use client';

import { Fragment } from 'react';
import { DashboardLayout } from 'src/wash/layouts/DashboardLayout';
import { cl } from 'src/wash/utils/utils';

import type { ReactElement, ReactNode } from 'react';
import { colors } from '../utils/theme';

/**********************************************************************************************
 * WithBackdrop: A component that wraps content with a conditional backdrop
 *
 * This component creates a layered backdrop effect with the following features:
 * 1. A conditional opacity based on the shouldDisplayBackdrop prop
 * 2. A top gradient overlay with blur effect
 * 3. A solid color bottom overlay
 * 4. Centered content with a specific vertical offset
 * 5. A DashboardLayout component rendered alongside the backdrop
 *
 * Props:
 * - children: ReactNode - The content to be displayed within the backdrop
 * - shouldDisplayBackdrop: boolean - Determines if the backdrop should be visible
 *********************************************************************************************/
export function WithBackdrop(props: {
  children: ReactNode;
  shouldDisplayBackdrop: boolean;
}): ReactElement {
  return (
    <Fragment>
      <div
        className={cl(
          'absolute left-0 top-0 z-20 flex size-full justify-center transition-opacity duration-1000',
          props.shouldDisplayBackdrop
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none',
        )}
      >
        <div
          className={'absolute left-0 top-0 z-20 h-1/2 w-full'}
          style={{
            background: `linear-gradient(360deg, ${colors.violet[100]} 0%, rgba(27, 16, 54, 0) 100%)`,
            backdropFilter: 'blur(8px)',
          }}
        />
        <div
          className={'absolute bottom-0 left-0 z-20 h-1/2 w-full bg-violet-100'}
        />
        <div className={'relative z-50 mt-[28dvh]'}>{props.children}</div>
      </div>
      <DashboardLayout />
    </Fragment>
  );
}

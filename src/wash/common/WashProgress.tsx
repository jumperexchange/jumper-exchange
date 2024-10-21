import { type ReactElement } from 'react';
import { colors } from '../utils/theme';
import styled from '@emotion/styled';

import type { TProgress } from '../types/types';

type TWashProgressProps = {
  progress?: TProgress;
  label?: string;
  className?: string;
  isSkeleton?: boolean;
};

/************************************************************************************************
 * Defining the styled components style for the WashProgress component
 *************************************************************************************************/
const ProgressSkeleton = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 400px;
  height: 56px;
  border-radius: 16px;
  transform: skewX(-6deg);
  margin-top: 0.5rem;
  border: 2px solid ${colors.violet[800]};
  background-color: ${colors.violet[600]};
`;

const ProgressBar = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 400px;
  height: 56px;
  border-radius: 16px;
  transform: skewX(-6deg);
  margin-top: 0.5rem;
  border: 2px solid ${colors.pink[800]};
  background-color: ${colors.violet[300]};
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  position: absolute;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  left: -1px;
  top: 0;
  height: 58px;
  background-image: linear-gradient(
    to right,
    ${colors.pink[600]},
    ${colors.pink[800]}
  );
  z-index: 20;
  width: ${({ progress }) => `${progress}%`};
`;

/************************************************************************************************
 * Defining the WashProgress component
 *************************************************************************************************/
export function WashProgress({
  progress = 0,
  label,
  className,
  isSkeleton,
}: TWashProgressProps): ReactElement {
  if (isSkeleton) {
    return <ProgressSkeleton />;
  }

  return (
    <ProgressBar className={className}>
      <span
        className={
          'z-50 text-[32px] font-black uppercase leading-[32px] text-white'
        }
      >
        {label ? label : `${progress}%`}
      </span>
      <ProgressBarFill progress={progress} />
    </ProgressBar>
  );
}

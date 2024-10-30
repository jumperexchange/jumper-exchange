import { type ReactElement } from 'react';
import { colors, mq } from '../utils/theme';
import styled from '@emotion/styled';
import { inter } from '../../fonts/fonts';

type TWashProgressProps = {
  progress?: number;
  label?: string;
  isSkeleton?: boolean;
};

/**************************************************************************************************
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
  ${mq[0]} {
    width: 285px;
  }
  ${mq[1]} {
    width: 400px;
  }
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
  ${mq[0]} {
    width: 285px;
  }
  ${mq[1]} {
    width: 400px;
  }
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  position: absolute;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  top: 0;
  left: -1px;
  height: 58px;
  background-image: linear-gradient(
    to right,
    ${colors.pink[600]},
    ${colors.pink[800]}
  );
  z-index: 20;
  width: ${({ progress }) => `calc(${progress}% + 1px)`};
`;

const ProgressLabel = styled.span`
  font-family: ${inter.style.fontFamily};
  z-index: 50;
  font-size: 32px;
  font-weight: 900;
  line-height: 32px;
  color: white;
  text-transform: uppercase;
`;

/**************************************************************************************************
 * Defining the WashProgress component
 *************************************************************************************************/
export function WashProgress({
  progress = 0,
  label,
  isSkeleton,
}: TWashProgressProps): ReactElement {
  if (isSkeleton) {
    return <ProgressSkeleton />;
  }

  return (
    <ProgressBar>
      <ProgressLabel>{label ? label : `${progress}%`}</ProgressLabel>
      <ProgressBarFill progress={progress} />
    </ProgressBar>
  );
}

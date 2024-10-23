import { type ForwardedRef, forwardRef, type ReactElement } from 'react';

import { cl } from '../utils/utils';
import { Button } from './Button';
import styled from '@emotion/styled';

import type { TQuest } from '../types/wash';
import { colors, SkewX6 } from '../utils/theme';
import { inter } from 'src/fonts/fonts';

type TCollectButtonProps = {
  onClick: VoidFunction;
  theme: 'pink' | 'cyan';
  disabled?: boolean;
  isBusy?: boolean;
  className?: string;
  progress: TQuest['progress'];
  progressSteps: TQuest['progressSteps'];
};

/************************************************************************************************
 * Defining the styled components style for the ButtonLayout component
 *************************************************************************************************/
const ProgressBar = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;
`;

const ProgressBarFill = styled.div<{ progress: number; background: string }>`
  position: absolute;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  top: 0;
  left: 0;
  height: 100%;
  z-index: -10;
  background: ${({ background }) => background};
  width: ${({ progress }) => `${progress}%`};
`;

const ProgressLabel = styled.span`
  font-family: ${inter.style.fontFamily};
  z-index: 20;
  color: white;
  text-transform: uppercase;
`;

/************************************************************************************************
 * Defining the ButtonLayout component
 *************************************************************************************************/
function ButtonLayout(props: TCollectButtonProps): ReactElement {
  const currentProgress = props.progress || 0;

  if (currentProgress === props.progressSteps) {
    return (
      <SkewX6>
        <ProgressLabel>{'Claim'}</ProgressLabel>
      </SkewX6>
    );
  }

  return (
    <ProgressBar>
      <ProgressBarFill
        background={
          props.theme === 'pink' ? colors.pink[700] : colors.cyan[700]
        }
        progress={(currentProgress / props.progressSteps) * 100}
      />
      <SkewX6>
        <ProgressLabel>{`${currentProgress}/${props.progressSteps}`}</ProgressLabel>
      </SkewX6>
    </ProgressBar>
  );
}

/************************************************************************************************
 * Defining the CollectButton component
 *************************************************************************************************/
export const CollectButton = forwardRef<HTMLButtonElement, TCollectButtonProps>(
  function CollectButton(
    props: TCollectButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactElement {
    return (
      <Button
        ref={ref}
        onClick={props.onClick}
        disabled={props.disabled}
        isBusy={props.isBusy}
        className={cl(
          'relative !h-[48px] !w-[164px] -skew-x-6 rounded-lg font-mono font-black uppercase text-white',
          props.progress === props.progressSteps
            ? '!bg-violet-600 cursor-pointer hover:!bg-violet-700 disabled:!bg-violet-200 disabled:!cursor-not-allowed disabled:!text-white/30'
            : props.theme === 'pink'
              ? '!bg-pink-300 !cursor-default'
              : '!bg-cyan-300 !cursor-default',

          props.className,
        )}
      >
        <ButtonLayout {...props} />
      </Button>
    );
  },
);

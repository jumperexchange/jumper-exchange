import type { CSSProperties } from 'react';
import { type ForwardedRef, forwardRef, type ReactElement } from 'react';

import { Button } from './Button';
import styled from '@emotion/styled';

import type { TQuest } from '../types/wash';
import { colors, SkewX6, SkewXNegative6 } from '../utils/theme';
import { inter } from '../../fonts/fonts';

type TCollectButtonProps = {
  onClick?: VoidFunction;
  theme: 'pink' | 'cyan';
  disabled?: boolean;
  isBusy?: boolean;
  style?: CSSProperties;
  progress: TQuest['progress'];
  progressSteps: TQuest['progressSteps'];
  size?: 'short' | 'long';
};

/**************************************************************************************************
 * Defining the styled components style for the ButtonLayout component
 *************************************************************************************************/
const ProgressBar = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
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
  border-radius: 0.5rem 0 0 0.5rem;
`;

const ProgressLabel = styled.span`
  font-family: ${inter.style.fontFamily};
  z-index: 20;
  color: white;
  text-transform: uppercase;
`;

/**************************************************************************************************
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
      <SkewXNegative6>
        <ProgressLabel>{`${currentProgress}/${props.progressSteps}`}</ProgressLabel>
      </SkewXNegative6>
    </ProgressBar>
  );
}

/**************************************************************************************************
 * Defining the CollectButton component
 *************************************************************************************************/
export const CollectButton = forwardRef<HTMLButtonElement, TCollectButtonProps>(
  function CollectButton(
    props: TCollectButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactElement {
    const StyledButton = styled(Button)`
      position: relative;
      height: 48px !important;
      transform: skewX(-6deg);
      overflow: hidden;
      font-weight: 900;
      text-transform: uppercase;
      color: white;
      border-radius: 0.5rem;
      cursor: ${props.progress === props.progressSteps ? 'pointer' : 'default'};
      background-color: ${
        props.progress === props.progressSteps
          ? `${colors.violet[600]} !important`
          : props.theme === 'pink'
            ? `${colors.pink[300]} !important`
            : colors.cyan[300]
      };

      &:hover {
        background-color: ${
          props.progress === props.progressSteps
            ? `${colors.violet[700]} !important`
            : props.theme === 'pink'
              ? `${colors.pink[300]} !important`
              : colors.cyan[300]
        };};
      }

      &:disabled {
        background-color: ${
          props.progress === props.progressSteps
            ? `${colors.violet[200]} !important`
            : 'inherit'
        };
        cursor: not-allowed;
        color: rgba(255, 255, 255, 0.3) !important;
      }
    `;
    return (
      <StyledButton
        ref={ref}
        onClick={props.onClick}
        disabled={props.disabled}
        isBusy={props.isBusy}
        style={props.style}
        size={props.size}
      >
        <ButtonLayout {...props} />
      </StyledButton>
    );
  },
);

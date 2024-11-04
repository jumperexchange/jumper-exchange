'use client';

import type { ButtonHTMLAttributes } from 'react';
import {
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  useMemo,
} from 'react';

import { IconSpinner } from './icons/IconSpinner';
import { inter } from '../../fonts/fonts';
import styled from '@emotion/styled';
import { colors } from '../utils/theme';

type TButtonProps = {
  children?: ReactElement;
  title?: string;
  isBusy?: boolean;
  theme?: 'pink' | 'violet' | 'white';
  size?: 'long' | 'short';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BusyButton = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const SpinnerIcon = styled(IconSpinner)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyledButtonRoot = styled.button`
  font-family: ${inter.style.fontFamily};
  position: relative;
  height: 64px;
  border-radius: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;

  font-feature-settings: inherit;
  font-variation-settings: inherit;
  font-size: 100%;
  line-height: inherit;
  letter-spacing: inherit;
  margin: 0;
  padding: 0;
`;

export const Button = forwardRef<HTMLButtonElement, TButtonProps>(
  function Button(
    props: TButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactElement {
    const { children, theme, title, isBusy, size = 'short', ...rest } = props;

    const buttonLayout = useMemo((): ReactElement | undefined => {
      if (isBusy) {
        return (
          <BusyButton>
            <SpinnerIcon />
          </BusyButton>
        );
      }
      if (title) {
        return <span>{title}</span>;
      }
      return children;
    }, [children, isBusy, title]);

    //TODO: export this out of function
    const StyledButton = styled(StyledButtonRoot)`
      background-color: ${theme === 'pink'
        ? colors.pink[800]
        : theme === 'violet'
          ? 'transparent'
          : 'white'};
      border: ${theme === 'violet'
        ? `2px solid ${colors.violet[800]}`
        : 'none'};
      color: ${theme === 'white' ? 'black' : 'white'};
      width: ${size === 'long' ? '320px' : '160px'};
      pointer-events: ${isBusy ? 'none' : 'auto'};

      &:hover {
        background-color: ${theme === 'pink'
          ? colors.pink[700]
          : theme === 'violet'
            ? colors.violet[600]
            : '#E6E6E6'};
      }

      &:disabled {
        background-color: ${theme === 'pink'
          ? colors.pink[400]
          : theme === 'violet'
            ? 'transparent'
            : '#CCC'};
        border-color: ${theme === 'violet'
          ? colors.violet[200]
          : 'transparent'};
        color: ${theme === 'white'
          ? 'rgba(0,0,0,0.3)'
          : 'rgba(255,255,255,0.3)'};
        cursor: not-allowed;
      }
    `;

    return (
      <StyledButton ref={ref} {...rest}>
        {buttonLayout}
      </StyledButton>
    );
  },
);
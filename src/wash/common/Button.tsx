'use client';

import {
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  useMemo,
} from 'react';
import { cl } from '../utils/utils';

import { IconSpinner } from './icons/IconSpinner';
import { inter } from 'src/fonts/fonts';

type TButtonProps = {
  children?: ReactElement;
  onClick?: VoidFunction;
  title?: string;
  disabled?: boolean;
  isBusy?: boolean;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'pink' | 'violet' | 'white';
  size?: 'long' | 'short';
};

export const Button = forwardRef<HTMLButtonElement, TButtonProps>(
  function Button(
    {
      children,
      title,
      theme,
      onClick,
      disabled,
      isBusy,
      className,
      style,
      size = 'short',
    }: TButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactElement {
    const buttonLayout = useMemo((): ReactElement | undefined => {
      if (isBusy) {
        return (
          <div className={'flex w-full justify-center'}>
            <IconSpinner className={'animate-spin'} />
          </div>
        );
      }
      if (title) {
        return <span>{title}</span>;
      }
      return children;
    }, [children, isBusy, title]);

    return (
      <button
        disabled={disabled}
        ref={ref}
        onClick={onClick}
        style={style}
        className={cl(
          inter.className,
          'relative h-[64px] rounded-2xl font-black uppercase disabled:cursor-not-allowed',
          theme === 'pink'
            ? 'bg-pink-800 hover:bg-pink-700 disabled:bg-pink-400 text-white disabled:text-white/30'
            : theme === 'violet'
              ? 'bg-transparent border-2 border-violet-800 disabled:border-violet-200 disabled:bg-transparent hover:bg-violet-600 text-white disabled:text-white/30'
              : 'bg-white hover:bg-[#E6E6E6] disabled:bg-[#CCC] text-black disabled:text-black/30',
          size === 'long' ? 'w-[320px]' : 'w-[160px]',
          isBusy ? 'pointer-events-none' : '',
          className,
        )}
      >
        {buttonLayout}
      </button>
    );
  },
);

import { type ForwardedRef, forwardRef, type ReactElement } from 'react';

import { cl } from '../utils/utils';
import { Button } from './Button';

import type { TQuest } from '../types/wash';

type TCollectButtonProps = {
  onClick: VoidFunction;
  theme: 'pink' | 'cyan';
  disabled?: boolean;
  isBusy?: boolean;
  className?: string;
  progress: TQuest['progress'];
  progressSteps: TQuest['progressSteps'];
};

function ButtonLayout(props: TCollectButtonProps): ReactElement {
  const currentProgress = props.progress || 0;

  if (currentProgress === props.progressSteps) {
    return (
      <div className={'skew-x-6'}>
        <span>{'Claim'}</span>
      </div>
    );
  }

  return (
    <div className={'relative flex h-full items-center justify-center'}>
      <div
        className={cl(
          'absolute -z-10 left-0 top-0 h-full rounded-l-lg',
          props.theme === 'pink' ? 'bg-pink-700' : 'bg-cyan-700',
        )}
        style={{ width: `${(currentProgress / props.progressSteps) * 100}%` }}
      />
      <div className={'skew-x-6'}>
        <span
          className={'z-20'}
        >{`${currentProgress}/${props.progressSteps}`}</span>
      </div>
    </div>
  );
}

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

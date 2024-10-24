import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';
import { cl } from '../utils/utils';

import type { ReactElement } from 'react';
import { colors } from '../utils/theme';

type TModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactElement;
};
export function Modal({
  isOpen,
  onClose,
  children,
  className,
}: TModalProps): ReactElement {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as={'div'} className={'relative z-[1000]'} onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter={'ease-out duration-300'}
          enterFrom={'opacity-0'}
          enterTo={'opacity-100'}
          leave={'ease-in duration-200'}
          leaveFrom={'opacity-100'}
          leaveTo={'opacity-0'}
        >
          <div
            className={`fixed inset-0 bg-[${colors.violet[100]}CC] backdrop-blur transition-opacity`}
          />
        </TransitionChild>
        <div className={'fixed inset-0 z-[1001] overflow-y-auto'}>
          <div
            className={
              'flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'
            }
          >
            <TransitionChild
              as={Fragment}
              enter={'ease-out duration-300'}
              enterFrom={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
              enterTo={'opacity-100 translate-y-0 sm:scale-100'}
              leave={'ease-in duration-200'}
              leaveFrom={'opacity-100 translate-y-0 sm:scale-100'}
              leaveTo={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
            >
              <DialogPanel
                className={cl(
                  'relative overflow-hidden flex max-w-2xl',
                  'flex-col items-center justify-center rounded-md',
                  '!bg-violet-400 !p-10 transition-all',
                  className,
                )}
              >
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

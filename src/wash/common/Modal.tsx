import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';

import type { ReactElement } from 'react';
import { colors, mq } from '../utils/theme';
import styled from '@emotion/styled';

type TModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactElement;
};

const StyledDialog = styled(Dialog)`
  position: relative;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  ${mq[1]} {
    padding: 0;
  }
`;

const ContentWrapper = styled.div`
  position: fixed;
  inset: 0px;
  z-index: 1001;
  overflow-y: auto;
`;

const Background = styled.div`
  position: fixed;
  inset: 0px;
  background: ${colors.violet[100]}CC;
  backdrop-filter: blur;
  transition: opacity 300ms ease-in-out;
`;

const StyledDialogPanel = styled(DialogPanel)`
  position: relative;
  overflow: hidden;
  display: flex;
  max-width: 42rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: ${colors.violet[400]} !important;
  padding: 40px !important;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
`;

export function Modal({
  isOpen,
  onClose,
  children,
}: TModalProps): ReactElement {
  return (
    <Transition show={isOpen} as={Fragment}>
      <StyledDialog as={'div'} onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter={'ease-out duration-300'}
          enterFrom={'opacity-0'}
          enterTo={'opacity-100'}
          leave={'ease-in duration-200'}
          leaveFrom={'opacity-100'}
          leaveTo={'opacity-0'}
        >
          <Background />
        </TransitionChild>
        <ContentWrapper>
          <ModalContent>
            <TransitionChild
              as={Fragment}
              enter={'ease-out duration-300'}
              enterFrom={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
              enterTo={'opacity-100 translate-y-0 sm:scale-100'}
              leave={'ease-in duration-200'}
              leaveFrom={'opacity-100 translate-y-0 sm:scale-100'}
              leaveTo={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
            >
              <StyledDialogPanel>{children}</StyledDialogPanel>
            </TransitionChild>
          </ModalContent>
        </ContentWrapper>
      </StyledDialog>
    </Transition>
  );
}

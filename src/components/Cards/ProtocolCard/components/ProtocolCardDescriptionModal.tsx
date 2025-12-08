import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { FC, PropsWithChildren } from 'react';
import { ProtocolDescriptionModalContentContainer } from '../ProtocolCard.styles';

interface ProtocolCardDescriptionModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export const ProtocolCardDescriptionModal: FC<
  ProtocolCardDescriptionModalProps
> = ({ isOpen, onClose, children }) => {
  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ProtocolDescriptionModalContentContainer>
        {children}
      </ProtocolDescriptionModalContentContainer>
    </ModalContainer>
  );
};

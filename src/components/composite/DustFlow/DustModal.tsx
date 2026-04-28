import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import type { FC } from 'react';
import { JumperWidget } from '@/components/composite/JumperWidget/JumperWidget';
import { useDustModalFlow } from './hooks/useDustModalFlow';

interface DustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DustModal: FC<DustModalProps> = ({ isOpen, onClose }) => {
  const {
    views,
    statusSheet,
    widgetSettings,
    widgetStyle,
    setWidgetNav,
    handleModalClose,
    formListeners,
  } = useDustModalFlow({ onClose, isOpen });

  return (
    <ModalContainer isOpen={isOpen} onClose={handleModalClose}>
      {isOpen ? (
        <JumperWidget
          views={views}
          statusSheet={statusSheet}
          style={widgetStyle}
          onNavigation={setWidgetNav}
          settings={widgetSettings}
          formListeners={formListeners}
        />
      ) : null}
    </ModalContainer>
  );
};

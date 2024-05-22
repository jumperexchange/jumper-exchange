import CloseIcon from '@mui/icons-material/Close';
import { Modal as MUIModal, useTheme } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import type { DataItem } from 'src/types/internal';
import {
  ModalContainer,
  ModalContent,
  ModalHeaderAppBar,
  ToolModaItemlTitle,
  ToolModalAvatar,
  ToolModalGrid,
  ToolModalIconButton,
  ToolModalTitle,
} from './ToolModal.style';

interface ToolModalProps {
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: DataItem[];
}

export const ToolModal = ({ title, open, setOpen, data }: ToolModalProps) => {
  const theme = useTheme();

  const handleOpenToolModal = () => {
    setOpen(false);
  };

  const handleCloseToolModal = () => {
    setOpen(false);
  };

  return (
    <MUIModal
      disableAutoFocus={true}
      open={open}
      onClick={handleOpenToolModal}
      onClose={handleCloseToolModal}
      sx={{ zIndex: 1700 }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContainer className="modal-container">
        <ModalHeaderAppBar>
          <ToolModalTitle
            id="modal-modal-title"
            variant={'lifiHeaderXSmall'}
            as="h3"
          >
            {title}
          </ToolModalTitle>
          <ToolModalIconButton
            aria-label="close modal"
            onClick={handleCloseToolModal}
          >
            <CloseIcon />
          </ToolModalIconButton>
        </ModalHeaderAppBar>
        <ModalContent container>
          {data?.map((el, index) => {
            return (
              <ToolModalGrid item key={`${title}-item-${index}`}>
                <ToolModalAvatar src={el.logoURI} />
                <ToolModaItemlTitle variant={'lifiBodyXSmall'}>
                  {el.name}
                </ToolModaItemlTitle>
              </ToolModalGrid>
            );
          })}
        </ModalContent>
      </ModalContainer>
    </MUIModal>
  );
};

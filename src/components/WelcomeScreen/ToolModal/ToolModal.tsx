import CloseIcon from '@mui/icons-material/Close';
import { Modal as MUIModal } from '@mui/material';
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
  const handleOpenToolModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpen(false);
  };

  const handleCloseToolModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

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
            variant={'headerXSmall'}
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
        <ModalContent container spacing={3}>
          {data?.map((el, index) => {
            return (
              <ToolModalGrid
                key={`${title}-item-${index}`}
                size={{ xs: 4, sm: 2 }}
              >
                <ToolModalAvatar src={el.logoURI} />
                <ToolModaItemlTitle variant={'bodyXSmall'}>
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

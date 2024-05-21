import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Grid,
  IconButton,
  Modal as MUIModal,
  Typography,
  useTheme,
} from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import type { DataItem } from 'src/types/internal';
import {
  ModalContainer,
  ModalContent,
  ModalHeaderAppBar,
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
          <Typography
            id="modal-modal-title"
            variant={'lifiHeaderXSmall'}
            component="h3"
            sx={{
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '18px',
              lineHeight: '24px',
              maxWidth: '80%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <IconButton
            sx={{
              color: theme.palette.text.primary,
              transform: 'translateX(8px)',
            }}
            aria-label="close modal"
            component="label"
            onClick={handleCloseToolModal}
          >
            <CloseIcon />
          </IconButton>
        </ModalHeaderAppBar>
        <ModalContent container>
          {data?.map((el, index) => {
            return (
              <Grid
                item
                key={`${title}-item-${index}`}
                width={72}
                textAlign={'center'}
              >
                <Avatar
                  src={el.logoURI}
                  sx={{
                    margin: 'auto',
                    height: 48,
                    width: 48,
                  }}
                />
                <Typography
                  variant={'lifiBodyXSmall'}
                  marginTop={theme.spacing(1.5)}
                  sx={{
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.white.main
                        : theme.palette.black.main,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 72,
                    height: 32,
                    maxHeight: 32,
                  }}
                >
                  {el.name}
                </Typography>
              </Grid>
            );
          })}
        </ModalContent>
      </ModalContainer>
    </MUIModal>
  );
};

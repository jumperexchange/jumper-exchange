import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Grid,
  IconButton,
  Modal as MUIModal,
  Typography,
  useTheme,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import {
  ModalContainer,
  ModalContent,
  ModalHeaderAppBar,
} from './StatsModal.style';

interface NavbarMenuProps {
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: any;
}

export const StatsModal = ({ title, open, setOpen, data }: NavbarMenuProps) => {
  const theme = useTheme();
  return (
    <MUIModal
      disableAutoFocus={true}
      open={open}
      onClick={() => {
        setOpen(false);
      }}
      onClose={() => {
        setOpen(false);
      }}
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
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '18px',
              lineHeight: '24px',
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
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </ModalHeaderAppBar>
        <ModalContent container>
          {data?.map(
            (
              el: { logoURI: string | undefined; name: string },
              index: number,
            ) => {
              return (
                <Grid
                  item
                  key={`${title}-item-${index}`}
                  width={'72px'}
                  textAlign={'center'}
                >
                  <Avatar
                    src={el.logoURI}
                    sx={{
                      margin: 'auto',
                      height: '48px',
                      width: '48px',
                    }}
                  />
                  <Typography
                    variant={'lifiBodyXSmall'}
                    marginTop={'12px'}
                    sx={{
                      color:
                        theme.palette.mode === 'dark'
                          ? theme.palette.white.main
                          : theme.palette.black.main,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '72px',
                      height: '32px',
                      maxHeight: '32px',
                    }}
                  >
                    {el.name}
                  </Typography>
                </Grid>
              );
            },
          )}
        </ModalContent>
      </ModalContainer>
    </MUIModal>
  );
};

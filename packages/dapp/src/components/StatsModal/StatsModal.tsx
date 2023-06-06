import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Grid,
  IconButton,
  Modal as MUIModal,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ModalContainer,
  ModalContent,
  ModalHeaderAppBar,
} from './StatsModal.style';
export const StatsModal = ({ title, open, setOpen, data }) => {
  const theme = useTheme();
  return (
    <MUIModal
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
      <ModalContainer>
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
          {data?.map((el, index) => {
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
                    height: '64px',
                    width: '64px',
                  }}
                />
                <Typography
                  variant={'lifiBodyXSmall'}
                  marginTop={'8px'}
                  sx={{
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
          })}
        </ModalContent>
      </ModalContainer>
    </MUIModal>
  );
};

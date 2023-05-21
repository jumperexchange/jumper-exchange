import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Breakpoint,
  Grid,
  IconButton,
  Modal as MUIModal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ModalHeader } from './StatsModal.style';
export const StatsModal = ({ title, open, setOpen, data }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  return (
    <MUIModal
      open={open}
      onClick={() => {
        setOpen(false);
      }}
      onClose={() => {
        setOpen(false);
      }}
      sx={{ zIndex: 1600 }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: isDesktop ? 0 : 'auto',
          padding: theme.spacing(3, 6, 6),
          borderRadius: '12px',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
              : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
          width: isDesktop ? '640px' : `calc( 100% - ${theme.spacing(6)})`,
          maxWidth: '640px',
          maxHeight: '85%',
          overflowY: 'auto',
          background:
            theme.palette.mode === 'dark'
              ? theme.palette.surface2.main
              : theme.palette.surface1.main,
        }}
      >
        <ModalHeader>
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
        </ModalHeader>
        <Grid
          container
          alignItems="center"
          gap={'28px'}
          mt={theme.spacing(3)}
          justifyContent={isDesktop ? 'inherit' : 'space-between'}
        >
          {data.map((el, index) => {
            return (
              <Grid
                item
                key={`${title}-item-${index}`}
                width={'72px'}
                textAlign={'center'}
                margin={'12px 0'}
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
        </Grid>
      </Box>
    </MUIModal>
  );
};

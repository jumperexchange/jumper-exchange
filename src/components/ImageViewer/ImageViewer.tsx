import ImageIcon from '@mui/icons-material/Image';
import { Box, Fade, Modal, Typography, alpha, useTheme } from '@mui/material';
import { useState } from 'react';
import type { MediaAttributes } from 'src/types';
import { ModalImage, PreviewImage } from '.';
interface ImageViewerProps {
  baseUrl: string;
  imageData: MediaAttributes;
}

export const ImageViewer = ({ baseUrl, imageData }: ImageViewerProps) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState('false');
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  const handleImage = (value: any) => {
    setImage(value);
    setOpen(true);
  };
  return (
    <>
      <PreviewImage
        src={imageData?.url}
        alt={imageData.caption ?? 'article-image'}
        onClick={(e) => handleImage(imageData.alternativeText)}
      />
      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open} timeout={500}>
          <Box
            onClick={handleClose}
            sx={{
              background: alpha(theme.palette.white.main, 0.5),
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'center',
            }}
          >
            <ModalImage
              src={imageData?.url}
              alt={imageData.caption ?? 'article-image'}
            />
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'flex-start'}
            >
              <ImageIcon
                sx={{
                  marginRight: theme.spacing(0.5),
                  width: 18,
                  height: 18,
                  alignItems: 'center',
                }}
              />
              <Typography variant="lifiHeaderSmall" sx={{ width: 'auto' }}>
                {imageData?.alternativeText}
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

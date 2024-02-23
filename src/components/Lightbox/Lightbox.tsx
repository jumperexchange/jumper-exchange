import CloseIcon from '@mui/icons-material/Close';
import { Fade, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import type { MediaAttributes } from 'src/types';
import {
  LightboxContainer,
  LightboxImage,
  LightboxModal,
  PreviewImage,
} from '.';
interface LightboxProps {
  baseUrl: string;
  imageData: MediaAttributes;
}

export const Lightbox = ({ baseUrl, imageData }: LightboxProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  const handleImage = (value: any) => {
    setOpen(true);
  };
  return (
    <>
      <PreviewImage
        src={imageData?.url}
        alt={imageData.caption ?? 'article-image'}
        onClick={() => handleImage(imageData.alternativeText)}
      />
      <LightboxModal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open} timeout={500}>
          <LightboxContainer onClick={handleClose}>
            <CloseIcon
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                margin: theme.spacing(2),
              }}
            />
            <LightboxImage
              src={imageData?.url}
              alt={imageData.caption ?? 'article-image'}
            />
            <Typography
              variant="lifiHeaderSmall"
              sx={{ width: 'auto', margin: 0, fontWeight: 400 }}
            >
              {imageData?.alternativeText}
            </Typography>
          </LightboxContainer>
        </Fade>
      </LightboxModal>
    </>
  );
};

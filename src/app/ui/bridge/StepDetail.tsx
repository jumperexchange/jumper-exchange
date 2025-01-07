'use client';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import type { ReactElement } from 'react';
import { StepDetailContainer } from './StepDetail.style';

interface StepDetailImageProps {
  imgUrl: string;
  width: number;
  height: number;
  alt: string;
}

interface StepDetailProps {
  title: string;
  description: string;
  img: StepDetailImageProps;
  content?: ReactElement;
}

const StepDetail = ({ title, description, img, content }: StepDetailProps) => {
  return (
    <StepDetailContainer sx={(theme) => ({ marginTop: theme.spacing(4) })}>
      <Box>
        <Typography variant="h4" marginY={2} sx={{ fontSize: '24px' }}>
          {title}
        </Typography>
        <Typography>{description}</Typography>
        {content}
      </Box>
      <Image
        src={img.imgUrl}
        alt={img.alt}
        width={img.width}
        height={img.height}
        style={{
          margin: 'auto',
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '12px',
        }}
      />
    </StepDetailContainer>
  );
};

export default StepDetail;

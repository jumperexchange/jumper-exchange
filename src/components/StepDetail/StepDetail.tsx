/* eslint-disable @next/next/no-img-element */
'use client';
import { Box, Typography } from '@mui/material';
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
        {description && <Typography>{description}</Typography>}
        {content}
      </Box>
      {img && (
        <img
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
      )}
    </StepDetailContainer>
  );
};

export default StepDetail;

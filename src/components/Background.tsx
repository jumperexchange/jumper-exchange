import { styled } from '@mui/material/styles';
import React from 'react';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientTopCenter,
} from './BackgroundGradient';

export interface BackgroundContainerProps {
  variant?: 'outlined';
  backgroundColor?: string;
  backgroundImageUrl?: URL;
}

const BackgroundContainer = styled('div', {
  name: 'Background', // The component name
  slot: 'root', // The slot name
})(({ theme }) => ({}));

// const StatValue = styled('div', {
//   name: 'Background',
//   slot: 'value',
// })(({ theme }) => ({
//   ...theme.typography.h3,
// }));

// const StatUnit = styled('div', {
//   name: 'Background',
//   slot: 'unit',
// })(({ theme }) => ({
//   ...theme.typography.body2,
//   color: theme.palette.text.secondary,
// }));

function Background() {
  return (
    <>
      <BackgroundContainer>
        <BackgroundGradientBottomLeft />
        <BackgroundGradientBottomRight />
        <BackgroundGradientTopCenter />
      </BackgroundContainer>
    </>
  );
}

export default Background;

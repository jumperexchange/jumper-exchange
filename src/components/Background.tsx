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
})<{ ownerState: BackgroundContainerProps }>(({ theme, ownerState }) => ({
  // overflow: 'hidden',
  // pointerEvents: 'none',
  // // background: ownerState.backgroundImageUrl
  // //   ? `url(${ownerState.backgroundImageUrl.href})`
  // //   : 'unset',
  // // backgroundColor: ownerState.backgroundColor || theme.palette.bg.main,
  // // typed-safe access to the `variant` prop
  // ...(ownerState.variant === 'outlined' && {
  //   border: `2px solid ${theme.palette.divider}`,
  //   boxShadow: 'none',
  //   [theme.breakpoints.up('sm' as Breakpoint)]: {
  //     backgroundRepeat: 'no-repeat',
  //     backgroundSize: 'cover',
  //   },
  // }),
}));

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

const Background = React.forwardRef<HTMLDivElement>(
  function Background(props, ref) {
    const ownerState = { ...props };
    console.log('OWNERSTATE', ownerState);
    return (
      <>
        <BackgroundContainer ref={ref} ownerState={ownerState}>
          <BackgroundGradientBottomLeft />
          <BackgroundGradientBottomRight />
          <BackgroundGradientTopCenter />
        </BackgroundContainer>
      </>
    );
  },
);

export default Background;

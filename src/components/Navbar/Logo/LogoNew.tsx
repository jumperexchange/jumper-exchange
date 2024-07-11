import { styled, useTheme } from '@mui/material/styles';
import React from 'react';
import { useThemeProps } from '@mui/material';

export interface LogoProps {
  variant?: 'outlined';
  backgroundColor?: string;
  backgroundImageUrl?: URL;
}

const LogoContainer = styled('div', {
  name: 'Logo', // The component name
  slot: 'root', // The slot name
})<{ ownerState: LogoProps }>(({ theme, ownerState }) => ({}));

function LogoNew(inprops) {

  const props = useThemeProps({ props: inprops, name: 'Logo' });

  // console.log('ABCDEODK', props)

  const theme = useTheme();
  // console.log('OWNERSTATELOGO', theme);
  return (
      <LogoContainer />
  );
}

export default LogoNew;

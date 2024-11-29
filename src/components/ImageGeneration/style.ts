import type { ImageTheme } from './ImageGeneration.types';

interface ContainerStylesProps {
  width: number;
  height: number;
  scalingFactor: number;
}

export const imageFrameStyles = ({
  height,
  width,
  scalingFactor,
}: ContainerStylesProps) => {
  return {
    position: 'relative',
    display: 'flex',
    width: width * scalingFactor,
    height: height * scalingFactor,
  };
};

export const imageStyles = ({
  height,
  width,
  scalingFactor,
}: ContainerStylesProps) => {
  return {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    objectFit: 'cover',
    width: width * scalingFactor,
    height: height * scalingFactor,
  };
};

export const contentContainerStyles = ({
  height,
  width,
  scalingFactor,
}: ContainerStylesProps) => {
  return {
    display: 'flex',
    transformOrigin: 'top left',
    position: 'relative',
    transform: `scale(${scalingFactor})`,
    height,
    width,
  };
};

export const contentPositioningStyles = () => {
  return {
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: 0,
  };
};

export const pageStyles = () => {
  return {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 24px',
  };
};

export const fieldContainerStyles = (extendedHeight?: boolean) => {
  return {
    display: 'flex',
    height: extendedHeight ? 149.6 : 104,
    borderRadius: '12px',
    borderWidth: '1px',
    justifyContent: 'space-between',
    borderStyle: 'solid',
  };
};

export const amountContainerStyles = () => {
  return {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '16px',
    width: '100%',
  };
};

export const amountTextStyles = (theme?: ImageTheme) => {
  return {
    color: theme === 'dark' ? '#ffffff' : '#000000',
    margin: 0,
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 600,
  };
};

export const tokenTextStyles = (
  type: 'amount' | 'symbol',
  theme?: ImageTheme,
) => {
  let additionalStyles = {};
  if (type === 'amount') {
    additionalStyles = {
      color: theme === 'dark' ? '#ffffff' : '#747474',
    };
  } else if (type === 'symbol') {
    additionalStyles = {
      color: theme === 'dark' ? 'rgb(187, 187, 187)' : '#747474',
      marginLeft: 64,
    };
  }

  return {
    margin: 0,
    fontSize: 12,
    fontWeight: 500,
    marginTop: 10,
    letterSpacing: '0.00938em',
    ...additionalStyles,
  };
};

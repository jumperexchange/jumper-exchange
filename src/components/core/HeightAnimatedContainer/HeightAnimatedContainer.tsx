import { FC, ReactNode, useState, useCallback } from 'react';
import { MotionProps } from 'framer-motion';

export interface HeightAnimatedContainerRenderProps {
  height: number;
  onHeightChange: (height: number) => void;
  motionProps: MotionProps;
}

export interface HeightAnimatedContainerProps {
  isOpen: boolean;
  offsetHeight?: number;
  animationDuration?: number;
  animationEase?:
    | 'easeInOut'
    | 'easeIn'
    | 'easeOut'
    | 'linear'
    | 'circIn'
    | 'circOut'
    | 'circInOut'
    | 'backIn'
    | 'backOut'
    | 'backInOut'
    | 'anticipate';
  children: (renderProps: HeightAnimatedContainerRenderProps) => ReactNode;
}

export const HeightAnimatedContainer: FC<HeightAnimatedContainerProps> = ({
  isOpen,
  offsetHeight = 0,
  animationDuration = 0.3,
  animationEase = 'easeInOut',
  children,
}) => {
  const [height, setHeight] = useState(0);

  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight);
  }, []);

  const motionProps: MotionProps = {
    initial: { height: 'auto' },
    animate: {
      height: isOpen ? height + offsetHeight : 'auto',
    },
    transition: {
      duration: animationDuration,
      ease: animationEase,
    },
  };

  return (
    <>
      {children({
        height,
        onHeightChange: handleHeightChange,
        motionProps,
      })}
    </>
  );
};

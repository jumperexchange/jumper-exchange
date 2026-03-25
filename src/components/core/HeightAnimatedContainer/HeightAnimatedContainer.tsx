import { type FC, type ReactNode, useState, useCallback } from 'react';
import type { EasingDefinition, MotionProps } from 'motion/react';

export interface HeightAnimatedContainerRenderProps {
  height: number;
  onHeightChange: (height: number) => void;
  motionProps: MotionProps;
}

export interface HeightAnimatedContainerProps {
  isOpen: boolean;
  defaultHeight?: number | string;
  offsetHeight?: number;
  animationDuration?: number;
  animationEase?: EasingDefinition;
  children: (renderProps: HeightAnimatedContainerRenderProps) => ReactNode;
}

export const HeightAnimatedContainer: FC<HeightAnimatedContainerProps> = ({
  isOpen,
  defaultHeight = 'auto',
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
    initial: { height: defaultHeight },
    animate: {
      height: isOpen ? height + offsetHeight : defaultHeight,
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

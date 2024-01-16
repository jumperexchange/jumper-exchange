// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { type CSSObject } from '@mui/material';
import { forwardRef, type MutableRefObject } from 'react';
import { SlideshowContainerBox } from '.';

interface SlideshowContainerProps {
  styles?: CSSObject;
  ref?: MutableRefObject<null>;
  children?: React.ReactNode;
}
export const SlideshowContainer = forwardRef<
  HTMLDivElement,
  SlideshowContainerProps
>(function MyInput(props, ref) {
  const { children, styles } = props;
  return (
    <SlideshowContainerBox
      ref={ref}
      sx={{
        ...styles,
      }}
    >
      {children}
    </SlideshowContainerBox>
  );
});

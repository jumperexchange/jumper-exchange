import { Slide, styled } from '@mui/material';

export interface StyledSlideProps {
  welcomeScreenClosed?: boolean;
}

export const StyledSlide = styled(Slide)<StyledSlideProps>(
  ({ theme, welcomeScreenClosed }) => ({
    // widget wrappers -> animations
    // '& +.widget-container .widget-wrapper > div': {
    //   [`@media screen and (min-height: 700px)`]: {
    //     marginTop: 'calc( 50vh - 680px / 2.75 - 40px - 24px )',
    //     '&:hover': {
    //       marginTop: 'calc( 50vh - 680px / 2.75 - 40px - 48px )',
    //     },
    //   },
    //   [`@media screen and (min-height: 900px)`]: {
    //     marginTop: 'calc( 50vh - 680px / 2.75 - 104px - 24px)',
    //     '&:hover': {
    //       marginTop: 'calc( 50vh - 680px / 2.75 - 104px - 48px)',
    //     },
    //   },
    // },
  }),
);

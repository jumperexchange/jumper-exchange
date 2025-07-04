import { Box } from '@mui/material';
import { CarouselPaginationBase } from './Carousel.types';

export const DotsPagination = ({ className }: CarouselPaginationBase) => {
  return (
    <Box
      className={`swiper-pagination ${className}`}
      sx={{
        position: 'absolute',
        bottom: 1,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}
    />
  );
};

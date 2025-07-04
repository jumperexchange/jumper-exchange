import { Box } from '@mui/material';

export interface DotsPaginationProps {
  className: string;
}

export const DotsPagination = ({ className }: DotsPaginationProps) => {
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

import { FC } from 'react';
import { SectionTitle } from '../ProfilePage/ProfilePage.style';
import { CarouselHeaderContainer } from './Carousel.style';
import { CarouselProps } from './Carousel';

interface CarouselHeaderProps
  extends Pick<CarouselProps, 'title' | 'headerInfo'> {
  hasNavigation: boolean;
}

export const CarouselHeader: FC<CarouselHeaderProps> = ({
  title,
  headerInfo,
  hasNavigation,
}) => {
  return (
    <CarouselHeaderContainer>
      {title && (
        <SectionTitle
          variant="bodyXLarge"
          sx={{
            ...(hasNavigation && {
              maxWidth: 'calc(100% - 88px)',
            }),
          }}
        >
          {title}
        </SectionTitle>
      )}
      {headerInfo ?? null}
    </CarouselHeaderContainer>
  );
};

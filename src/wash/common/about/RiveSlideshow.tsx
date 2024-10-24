import { useState, type ReactElement } from 'react';
import styled from '@emotion/styled';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import Image from 'next/image';
import { mq } from 'src/wash/utils/constants';

const RiveCarouselWrapper = styled.div`
  width: 3840px;
  height: 406px;
  position: relative;
  display: block;
  ${mq[0]} {
    display: none;
  }
`;
const SlideshowImage = styled(Image)<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 3840px;
  height: 406px;
  min-width: 3840px;
  min-height: 406px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
`;
const SlideshowMobileImage = styled(Image)<{ isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 1200px;
  height: 203px;
  min-width: 1200px;
  min-height: 203px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
`;
const RiveMobileCarouselWrapper = styled.div`
  display: none;
  ${mq[0]} {
    display: block;
    position: relative;
    width: 1200px;
    height: 203px;
  }
`;

export default function RiveSlideshowWrapper(): ReactElement {
  const [isLoaded, set_isLoaded] = useState<boolean>(false);
  const { RiveComponent: RiveSlideshow, rive } = useRive({
    src: '/wash/about/landing-slideshow.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: () => {
      set_isLoaded(true);
      setTimeout(() => rive?.play(), 1000);
    },
  });

  const { RiveComponent: RiveMobileSlideshow, rive: mobileRive } = useRive({
    src: '/wash/about/landing-slideshow-mobile.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: () => {
      set_isLoaded(true);
      setTimeout(() => mobileRive?.play(), 1000);
    },
  });

  return (
    <>
      <RiveMobileCarouselWrapper>
        <SlideshowMobileImage
          isLoaded={isLoaded}
          src={'/wash/about/slideshow-mobile.png'}
          alt={'slideshow'}
          width={1200}
          height={203}
        />
        <RiveMobileSlideshow
          width={1200}
          height={203}
          style={{ position: 'absolute', opacity: isLoaded ? 1 : 0 }}
        />
      </RiveMobileCarouselWrapper>
      <RiveCarouselWrapper>
        <SlideshowImage
          isLoaded={isLoaded}
          src={'/wash/about/slideshow.png'}
          alt={'slideshow'}
          width={3840}
          height={406}
        />
        <RiveSlideshow
          width={3840}
          height={406}
          style={{
            position: 'absolute',
            opacity: isLoaded ? 1 : 0,
          }}
        />
      </RiveCarouselWrapper>
    </>
  );
}

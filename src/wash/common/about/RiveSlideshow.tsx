import { useState, type ReactElement } from 'react';
import styled from '@emotion/styled';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import Image from 'next/image';
import { mq } from '../../utils/theme';

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const RiveCarouselWrapper = styled.div`
  width: 3840px;
  height: 406px;
  position: relative;
  ${mq[1]} {
    width: 1920px;
    height: 203px;
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
  ${mq[1]} {
    width: 1920px;
    height: 203px;
    min-width: 1920px;
    min-height: 203px;
  }
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
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

  return (
    <Wrapper>
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
    </Wrapper>
  );
}

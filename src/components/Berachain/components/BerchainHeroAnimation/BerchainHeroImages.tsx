import type { SxProps, Theme } from '@mui/material';
import { useRef } from 'react';
import {
  BerachainWelcomeBear,
  BeraChainWelcomeIllustrations,
} from './BerachainHeroImages.style';

interface BerachainHeroImagesProps {
  sx?: SxProps<Theme>;
}

export const BerachainHeroImages = ({ sx }: BerachainHeroImagesProps) => {
  const illustrationsRef = useRef(null);

  // disabled glitchy effect
  // useEffect(() => {
  //   const illustrations = illustrationsRef.current;

  //   const tl = gsap.timeline({ delay: 1.5, repeat: 1 }); // Repeat the animation once (total of two plays)

  //   tl.fromTo(illustrations, { opacity: 0 }, { opacity: 1, duration: 0.1 })
  //     .to(illustrations, {
  //       filter: 'blur(4px) invert(1)',
  //       marginLeft: '-6px',
  //       duration: 0.05,
  //     })
  //     .to(illustrations, {
  //       filter: 'blur(0px) invert(0)',
  //       marginLeft: '8px',
  //       duration: 0.02,
  //     })
  //     .to(illustrations, { marginLeft: '0px', duration: 0.03 })
  //     .to(illustrations, {
  //       opacity: 0.5,
  //       filter: 'blur(0px) invert(0)',
  //       marginLeft: '-6px',
  //       duration: 0.11,
  //     })
  //     .to(illustrations, {
  //       opacity: 0,
  //       marginLeft: '4px',
  //       filter: 'blur(2px) invert(0.5)',
  //       duration: 0.03,
  //     })
  //     .to(illustrations, {
  //       opacity: 1,
  //       filter: 'blur(0px) invert(0)',
  //       marginLeft: '0px',
  //       duration: 0.01,
  //     })
  //     .to(illustrations, { opacity: 0.5, marginLeft: '-4px', duration: 0.05 })
  //     .to(illustrations, { opacity: 1, marginLeft: '4px', duration: 0.02 })
  //     .to(illustrations, { opacity: 0.7, marginLeft: '0px', duration: 0.08 })
  //     .to(illustrations, { opacity: 1, duration: 0.02 })
  //     .to(illustrations, {
  //       opacity: 0.2,
  //       filter: 'blur(4px) invert(0.7)',
  //       duration: 0.02,
  //     })
  //     .to(illustrations, {
  //       opacity: 1,
  //       filter: 'blur(0px) invert(0)',
  //       duration: 0.11,
  //     })
  //     .to(illustrations, {
  //       opacity: 0.5,
  //       x: 3,
  //       duration: 0.1,
  //     })
  //     .to(illustrations, {
  //       opacity: 1,
  //       x: 0,
  //       filter: 'blur(0px) invert(0)',
  //       duration: 0.25,
  //     });
  // }, []);

  return (
    <BeraChainWelcomeIllustrations ref={illustrationsRef} sx={sx}>
      <BerachainWelcomeBear
        src="/berachain/berachain-sir-bridgealot-astronaut-w-glow.png"
        alt="Berachain Pepe"
        width={278}
        height={395}
        sx={{
          left: 0,
        }}
      />
      <BerachainWelcomeBear
        src="/berachain/berachain-bear-astronaut-w-glow.png"
        alt="Berachain Bear"
        width={304}
        height={395}
        style={{
          right: 0,
        }}
      />
    </BeraChainWelcomeIllustrations>
  );
};

'use client';
import { useMemo } from 'react';
import {
  SnowflakeOverlayContainer,
  SnowflakeWrapper,
  Snowflake,
} from './SnowflakeOverlay.styles';
import { generateSnowflakes } from './utils';

export function SnowflakeOverlay() {
  const snowflakes = useMemo(() => generateSnowflakes(), []);

  return (
    <SnowflakeOverlayContainer aria-hidden="true">
      {snowflakes.map(({ id, left, size, duration, delay, swayDuration }) => (
        <SnowflakeWrapper
          key={id}
          $left={left}
          $delay={delay}
          $swayDuration={swayDuration}
        >
          <Snowflake $size={size} $duration={duration} $delay={delay} />
        </SnowflakeWrapper>
      ))}
    </SnowflakeOverlayContainer>
  );
}

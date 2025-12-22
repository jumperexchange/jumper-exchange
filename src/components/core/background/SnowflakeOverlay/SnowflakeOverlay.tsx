'use client';
import { useMemo } from 'react';
import {
  SnowflakeOverlayContainer,
  Snowflake,
} from './SnowflakeOverlay.styles';
import { generateSnowflakes } from './utils';

export function SnowflakeOverlay() {
  const snowflakes = useMemo(() => generateSnowflakes(), []);

  return (
    <SnowflakeOverlayContainer aria-hidden="true">
      {snowflakes.map(({ id, left, size, duration, delay, swayDuration }) => (
        <Snowflake
          key={id}
          $left={left}
          $size={size}
          $duration={duration}
          $delay={delay}
          $swayDuration={swayDuration}
        />
      ))}
    </SnowflakeOverlayContainer>
  );
}

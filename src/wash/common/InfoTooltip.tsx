/** @jsxImportSource @emotion/react */

import { colors, mq } from '../utils/theme';
import { IconInfo } from './icons/IconInfo';

import { useState, type ReactElement } from 'react';
import styled from '@emotion/styled';
import { inter } from '../../fonts/fonts';
import type { TTooltipPosition } from '../types/types';

const TooltipWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const TooltipDescription = styled.p`
  transform: skewX(6deg);
  color: white;
  font-weight: bold;
  ${inter.style}
  ${mq[1]} {
    font-size: 10px;
  }
`;

const TooltipTrigger = styled.div`
  cursor: help;
`;

export function InfoTooltip({
  position = 'right',
  description,
}: {
  description: string;
  position?: TTooltipPosition;
}): ReactElement {
  const Tooltip = styled.div<{ position: TTooltipPosition }>`
    position: absolute;
    left: ${position === 'right' ? '2rem' : ''};
    right: ${position === 'left' ? '3rem' : ''};
    top: 0;
    z-index: 10;
    width: 530px;
    transform: skewX(-6deg);
    border-radius: 0.75rem;
    border: 2px solid ${colors.violet[800]};
    background-color: black;
    padding: 1rem 1.5rem;
    &:focus {
      outline: none;
    }
    ${mq[1]} {
      left: unset;
      right: 1rem;
      top: 2rem;
      max-width: 200px;
    }
  `;
  const [showTooltip, set_showTooltip] = useState(false);

  return (
    <TooltipWrapper>
      <TooltipTrigger
        onMouseEnter={() => set_showTooltip(true)}
        onMouseLeave={() => set_showTooltip(false)}
      >
        <IconInfo color={colors.violet[800]} />
      </TooltipTrigger>
      {showTooltip && (
        <Tooltip position={position}>
          <TooltipDescription>{description}</TooltipDescription>
        </Tooltip>
      )}
    </TooltipWrapper>
  );
}

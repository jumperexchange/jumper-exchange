/** @jsxImportSource @emotion/react */

import { colors } from '../utils/theme';
import { css } from '@emotion/react';

import { IconInfo } from './icons/IconInfo';

import { useState, type ReactElement } from 'react';
import { inter } from 'src/fonts/fonts';
import styled from '@emotion/styled';

const TooltipWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const Tooltip = styled.div`
  position: absolute;
  left: 2rem;
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
`;
const TooltipTrigger = styled.div`
  cursor: help;
`;

export function InfoPopup(props: { description: string }): ReactElement {
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
        <Tooltip>
          <p
            css={css`
              transform: skewX(6deg);
              color: white;
              font-weight: bold;
              ${inter.style}
            `}
          >
            {props.description}
          </p>
        </Tooltip>
      )}
    </TooltipWrapper>
  );
}

/** @jsxImportSource @emotion/react */

import { colors } from '../utils/theme';
import { css } from '@emotion/react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import { IconInfo } from './icons/IconInfo';

import type { ReactElement } from 'react';
import { inter } from 'src/fonts/fonts';

const popoverPanelStyle = css`
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
export function InfoPopup(props: { description: string }): ReactElement {
  return (
    <Popover
      css={css`
        position: relative;
        display: flex;
        align-items: center;
      `}
    >
      <PopoverButton>
        <IconInfo />
      </PopoverButton>
      <PopoverPanel as={'div'} css={popoverPanelStyle}>
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
      </PopoverPanel>
    </Popover>
  );
}

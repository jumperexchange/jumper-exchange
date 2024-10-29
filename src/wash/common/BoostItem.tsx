import Image from 'next/image';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';
import { inter } from '../../fonts/fonts';
import type { TCleaningItem } from '../types/wash';
import { CLEANING_ITEMS } from '../utils/constants';
import { mq, Absolute, colors } from '../utils/theme';
import { Counter } from './Counter';

type TBoostItemProps = {
  boostType: 'soap' | 'sponge' | 'cleanser';
  amount: number;
  disabled?: boolean;
  handleUseItem: (item: TCleaningItem) => Promise<void>;
  isSkeleton?: boolean;
};

/**************************************************************************************************
 * Defining the styled components style for the Boost item component
 *************************************************************************************************/
const PowerUpWrapperSkeleton = styled.div`
  width: 130px;
  height: 88px;
  transform: skewX(-6deg);
  border-radius: 16px;
  background-color: ${colors.violet[400]};
  box-shadow: 4px 4px 0px 0px ${colors.violet[800]};
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const PowerUpContentSkeleton = styled.div`
  width: 76px;
  height: 32px;
  border-radius: 8px;
  background-color: ${colors.violet[600]};
  margin: 0.5rem;
`;

const PowerUpWrapper = styled.button`
  display: flex;
  height: 88px;
  width: 120.76px;
  transform: skewX(-6deg);
  justify-content: flex-end;
  align-items: flex-end;
  border-radius: 16px;
  background-color: ${colors.violet[200]};
  box-shadow: 4px 4px 0px 0px ${colors.violet[800]};
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    background-color: ${colors.violet[300]};
  }
  &:hover img {
    width: 85px;
    height: 85px;
  }
  ${mq[1]} {
    width: 88px;
    height: 88px;
  }
`;
const PowerUpPercentageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.25rem 0.5rem;
  text-align: right;
`;

const PowerUpPercentageAdd = styled.span<{ disabled: boolean }>`
  font-size: 12px;
  line-height: 12px;
  font-weight: 700;
  color: white;
  font-style: italic;
  transform: skewX(6deg);
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  font-family: ${inter.style.fontFamily};
`;

const PowerUpPercentage = styled.span<{ disabled: boolean }>`
  font-size: 28px;
  line-height: 28px;
  font-weight: 900;
  color: white;
  font-style: italic;
  transform: skewX(6deg);
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  font-family: ${inter.style.fontFamily};
  ${mq[1]} {
    font-size: 20px;
    line-height: 28px;
  }
`;

const PowerUpLogo = styled(Image)<{ disabled: boolean }>`
  width: 80px;
  transition: all 0.1s ease-in-out;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  height: auto;
  ${mq[1]} {
    width: 64px;
  }
`;

/**********************************************************************************************
 * BoostItem Component
 *
 * This component renders a boost item with different states: skeleton, enabled, and disabled.
 *
 * Props:
 * - boostType: The type of boost item.
 * - disabled: Boolean indicating if the item is disabled.
 * - amount: The amount of boost items available.
 * - handleUseItem: Function to handle the use of the item.
 * - isSkeleton: Boolean indicating if the skeleton state should be displayed.
 *
 * The component conditionally renders a skeleton view or the actual boost item based on the
 * isSkeleton prop. If the item is disabled or the amount is zero, it applies a disabled state.
 ************************************************************************************************/
export function BoostItem({
  boostType,
  disabled,
  amount,
  handleUseItem,
  isSkeleton,
}: TBoostItemProps): ReactElement {
  const isDisabled = disabled || amount === 0;
  if (isSkeleton) {
    return (
      <PowerUpWrapperSkeleton>
        <PowerUpContentSkeleton />
      </PowerUpWrapperSkeleton>
    );
  }

  return (
    <PowerUpWrapper
      disabled={isDisabled}
      onClick={async () => handleUseItem(CLEANING_ITEMS[boostType])}
    >
      <PowerUpPercentageWrapper>
        <PowerUpPercentageAdd disabled={isDisabled}>
          {'ADD'}
        </PowerUpPercentageAdd>
        <PowerUpPercentage disabled={isDisabled}>
          {CLEANING_ITEMS[boostType].percentage}
        </PowerUpPercentage>
      </PowerUpPercentageWrapper>

      <Absolute left={'-8px'} top={'-16px'}>
        <PowerUpLogo
          disabled={isDisabled}
          src={CLEANING_ITEMS[boostType].logo}
          alt={''}
          width={80}
          height={80}
        />
      </Absolute>
      <Absolute right={'-4px'} top={'-8px'}>
        <Counter amount={amount} isDisabled={disabled} />
      </Absolute>
    </PowerUpWrapper>
  );
}

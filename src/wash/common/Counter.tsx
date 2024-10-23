import { useMemo, type ReactElement } from 'react';
import styled from '@emotion/styled';

import { IconBlock } from './icons/IconBlock';
import { colors } from '../utils/theme';

type TCounterProps = {
  amount: number;
  isDisabled?: boolean;
};

/************************************************************************************************
 * Defining the styled components style for the Counter component
 *************************************************************************************************/
const CounterBubble = styled.div<{ backgroundColor: string }>`
  color: white;
  width: min-content;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  font-size: 14px;
  line-height: 20px;
  height: 24px;
  font-weight: 900;
  padding: 2px 8px 2px 8px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

/************************************************************************************************
 * Counter Component
 *
 * This component renders a counter bubble with a dynamic background color and label.
 * It handles different states such as disabled, zero amount, and amounts over 99.
 *
 * Props:
 * - amount: number - The count to display
 * - isDisabled: boolean (optional) - Whether the counter is disabled
 *
 * The component determines the background color and label based on the amount and disabled state.
 * It uses a styled component (CounterBubble) for consistent styling across different states.
 ************************************************************************************************/
export function Counter({ amount, isDisabled }: TCounterProps): ReactElement {
  /**********************************************************************************************
   * Determines the label to display in the counter bubble based on the amount and disabled state.
   * Returns:
   * - IconBlock component if the counter is disabled
   * - '99+' if the amount exceeds 99
   * - The actual amount (or 0 if undefined) otherwise
   *********************************************************************************************/
  const label = useMemo((): string | number | ReactElement => {
    if (isDisabled) {
      return <IconBlock />;
    }
    if (amount > 99) {
      return 'x99+';
    }
    if (amount === 0) {
      return 0;
    }
    return `x${amount}`;
  }, [amount, isDisabled]);

  return (
    <CounterBubble
      backgroundColor={
        isDisabled || amount === 0 ? colors.pink[300] : colors.pink[800]
      }
    >
      {label}
    </CounterBubble>
  );
}

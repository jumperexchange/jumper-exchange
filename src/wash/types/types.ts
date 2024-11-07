/* eslint-disable @typescript-eslint/naming-convention */
import type { ReactNode } from 'react';
import type { TColor } from '../utils/theme';

export type TZeroToTenRange = TIntRange<0, 11>;

type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type TIntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export type TNFTItem = {
  imageUri?: string;
  name?: string;
  progress?: number;
  isRevealed?: boolean;
  color?: TColor;
  isRare?: boolean;
  rewardName?: string;
};

export type TItems = {
  cleanser: number;
  soap: number;
  sponge: number;
};

export type TOptionalRenderProps<TProps, TChildren = ReactNode> =
  | TChildren
  | ((renderProps: TProps) => TChildren);

export const optionalRenderProps = <TProps>(
  children: TOptionalRenderProps<TProps>,
  renderProps: TProps,
): ReactNode =>
  typeof children === 'function' ? children(renderProps) : children;

/**************************************************************************************************
 * TAPIQuest: Defines the structure for Quest data returned by the backend
 *
 * @property id - The unique identifier for the API quest instance
 * @property questId - The identifier of the associated quest template
 * @property createdAt - The date when the quest was created
 * @property startDate - If the quest is time-locked, the date when the quest was started
 * @property endDate - If the quest is time-locked, the date when the quest will end
 * @property progress - The current progress of the quest (integer range from 0 to 100)
 ************************************************************************************************/
export type TAPIQuest = {
  id: string;
  questId: string;
  createdAt: Date;
  startDate: Date | null;
  endDate: Date | null;
  progress: TIntRange<0, number>;
};

export type TTooltipPosition = 'left' | 'right';

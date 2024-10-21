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
  progress?: TProgress;
  isRevealed?: boolean;
  color?: TColor;
  isRare?: boolean;
};

export type TItems = {
  item1: number;
  item2: number;
  item3: number;
};

export type TOptionalRenderProps<TProps, TChildren = ReactNode> =
  | TChildren
  | ((renderProps: TProps) => TChildren);

export const optionalRenderProps = <TProps>(
  children: TOptionalRenderProps<TProps>,
  renderProps: TProps,
): ReactNode =>
  typeof children === 'function' ? children(renderProps) : children;

export type TProgress = TIntRange<0, 101>;

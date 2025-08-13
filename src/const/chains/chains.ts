import * as chains_ from 'viem/chains';
import { Chain } from 'viem/chains';
import * as hyperwave from './hyperwave';
import * as katana from './katana';

export const chains: Record<number, Chain> = {
  ...chains_,
  [999]: hyperwave.hyperevm,
  [747474]: katana.katana,
};

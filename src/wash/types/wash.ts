import type { ReactNode } from 'react';
import type { TIntRange } from './types';

/**********************************************************************************************
 * TQuest: Defines the structure for quest item properties
 *
 * @property id - The unique identifier for the quest
 * @property order - The order of the quest
 * @property questType - The type of quest ('common' or 'rare')
 * @property title - The title of the quest
 * @property description - A detailed description of the quest
 * @property progressSteps - The total number of steps required to complete the quest
 * @property expirationTimestamp - The timestamp when the quest expires
 * @property progress - The current progress of the quest (integer range from 0 to a number)
 *********************************************************************************************/
export type TQuest = {
  id: string;
  order: number;
  questType: 'common' | 'rare';
  title: string;
  description: string | ReactNode;
  progressSteps: number;
  expirationTimestamp?: number;
  progress?: TIntRange<0, number>;
  powerUp: TCleaningItem;
  sendingToken: string[];
  receivingToken: string[];
};

/**********************************************************************************************
 * TCleaningItem: Defines the structure for cleaning item properties
 *
 * @property id - The unique identifier for the cleaning item ('soap', 'sponge', or 'cleanser')
 * @property logo - The path to the logo image for the cleaning item
 * @property percentage - The boost percentage as a string ('+5%', '+10%', or '+15%')
 * @property boost - The numerical boost value (5, 10, or 15)
 *********************************************************************************************/
export type TCleaningItem = {
  id: 'soap' | 'sponge' | 'cleanser';
  message: string;
  logo: string;
  percentage: '+5%' | '+10%' | '+15%';
  boost: 5 | 10 | 15;
  maxAmount: number;
};

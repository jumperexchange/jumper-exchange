import type { TIntRange } from './types';

/**********************************************************************************************
 * TQuest: Defines the structure for quest item properties
 *
 * @property questType - The type of quest ('common' or 'rare')
 * @property title - The title of the quest
 * @property description - A detailed description of the quest
 * @property progressSteps - The total number of steps required to complete the quest
 * @property expirationTimestamp - The timestamp when the quest expires
 * @property progress - The current progress of the quest (integer range from 0 to a number)
 *********************************************************************************************/
export type TQuest = {
  questType: 'common' | 'rare';
  heading: string;
  title: string;
  description: string;
  progressSteps: number;
  expirationTimestamp?: number;
  progress?: TIntRange<0, number>;
  powerUp: TCleaningItem;
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
  level: 1 | 2 | 3;
  boost: 5 | 10 | 15;
};

import type { TColor } from './theme';
import type { TCleaningItem, TQuest } from '../types/wash';
import { getItem } from './utils';

/************************************************************************************************
 * WASH_ENDPOINT_ROOT_URI
 *
 * This constant defines the root URI for the API.
 *************************************************************************************************/
export const WASH_ENDPOINT_ROOT_URI = 'https://jumper-wash.builtby.dad';

/************************************************************************************************
 * Default NFT color
 *
 * This constant defines the default color for NFTs. Useful for the placeholder.
 *************************************************************************************************/
export const DEFAULT_NFT_COLOR: TColor = 'violet';

/************************************************************************************************
 * Defining the different cleaning items and their properties
 *
 * Check @file://types/wash.ts for more information
 *************************************************************************************************/
export const CLEANING_ITEMS: Record<TCleaningItem['id'], TCleaningItem> = {
  soap: {
    id: 'soap',
    message: 'I am using one soap',
    logo: '/wash/violet-stroke-soap.png',
    percentage: '+5%',
    boost: 5,
  },
  sponge: {
    id: 'sponge',
    message: 'I am using one sponge',
    logo: '/wash/violet-stroke-sponge.png',
    percentage: '+10%',
    boost: 10,
  },
  cleanser: {
    id: 'cleanser',
    message: 'I am using one cleanser',
    logo: '/wash/violet-stroke-cleanser.png',
    percentage: '+15%',
    boost: 15,
  },
};

/************************************************************************************************
 * Defining the different quests and their properties
 *
 * Check @file://types/wash.ts for more information
 *************************************************************************************************/
export const QUESTS: TQuest[] = [
  {
    id: 'quest1',
    order: 1,
    questType: 'rare',
    title: 'Dump $JUP for $SOL',
    description:
      'Yep. We woke up and chose violence. Dump JUPITER tokens for SOL. Ducks.',
    progressSteps: 10,
    powerUp: getItem('cleanser', 'blue'),
  },
  {
    id: 'quest2',
    order: 2,
    questType: 'rare',
    title: 'Trade between $WIF & $POPCAT',
    description:
      'Are you a dog(coin) person or a cat(coin) person? It doesn’t matter. Swap WIF and POPCAT to earn a boost.',
    progressSteps: 5,
    powerUp: getItem('cleanser', 'blue'),
  },
  {
    id: 'quest3',
    order: 3,
    questType: 'rare',
    title: 'Swap between $SOL & $MOTHER',
    description:
      'A mASSive opportunity for you to earn a wash trading boost by buying this hot new ASSet.',
    progressSteps: 10,
    powerUp: getItem('sponge', 'blue'),
  },
  {
    id: 'quest4',
    order: 4,
    questType: 'common',
    title: 'Swap between $USDC & $USDT',
    description: 'The real authentic washtrading experience… snore.',
    progressSteps: 5,
    powerUp: getItem('soap', 'pink'),
  },
  {
    id: 'quest5',
    order: 5,
    questType: 'rare',
    title: 'Swap between $SOL & $DRIFT',
    description:
      'Get your Drift on and acquire some tokens from our good friends at Drift.',
    progressSteps: 10,
    powerUp: getItem('sponge', 'blue'),
  },
  {
    id: 'quest6',
    order: 6,
    questType: 'common',
    title: 'Dump $TREMP for $BODEN',
    description:
      'The battle we all wanted, but never got. Time to run it back for a wash boost.',
    progressSteps: 2,
    powerUp: getItem('soap', 'pink'),
  },
  {
    id: 'quest7',
    order: 7,
    questType: 'common',
    title: 'Swap between $WIF, $MICHI, or $MEW',
    description:
      'This quest gets you to trade Ansem tokens, in the hope that he’ll engage with us. Can’t hurt… right?',
    progressSteps: 10,
    powerUp: getItem('soap', 'pink'),
  },
  {
    id: 'quest8',
    order: 8,
    questType: 'common',
    title: 'Swap between $MOODENG and $FWOG',
    description:
      'Cute flavour of the month vs cute flavour of the month. You don’t have to pick sides. Just swap between them!',
    progressSteps: 8,
    powerUp: getItem('soap', 'pink'),
  },
  {
    id: 'quest9',
    order: 9,
    questType: 'common',
    title: 'Swap between $Trump and $USA',
    description:
      'Play some Bruce Springsteen, put on your Maga hat and start trading like a true patriot. Murica mfer!',
    progressSteps: 10,
    powerUp: getItem('soap', 'pink'),
  },
];

/**********************************************************************************************
 * TOOLTIP_MESSAGES
 *
 * This object contains the tooltip messages for various elements in the application.
 * Each key represents a specific tooltip, and its value is the message to be displayed.
 *
 * powerUp: Explains how to obtain and use power-ups for NFT progress boost.
 * progress: Describes how Solana swaps and quests contribute to washing the NFT.
 * quest: Provides information about quests and their role in accelerating NFT washing.
 ************************************************************************************************/
export const TOOLTIP_MESSAGES = {
  powerUp:
    'Complete quests to gain power ups which can be used to give a big progress boost to your current NFT.',
  progress:
    'Every trade you make on Solana with Jumper helps wash your NFT clean. It takes $10,000 of volume to fully wash the NFT, or you can complete quests for power ups to boost your progress!',
  quest:
    'Every Solana swap you make on Jumper helps wash your NFT. But you can wash your NFT even faster by completing quests for items that boost your progress! Lfg.',
};

/**********************************************************************************************
 * Color Dictionary
 *
 * This constant maps numeric keys to color values of type TColor.
 * It's used to associate specific colors with numeric identifiers,
 * which can be useful for color-coding or theming based on numeric inputs.
 ************************************************************************************************/
export const colorDict: Record<number, TColor> = {
  1: 'pink',
  2: 'green',
  3: 'orange',
  4: 'red',
  5: 'blue',
  6: 'brown',
};

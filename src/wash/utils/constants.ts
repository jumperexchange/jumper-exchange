import type { TColor } from './theme';
import type { TCleaningItem, TQuest } from '../types/wash';

/**************************************************************************************************
 * WASH_ENDPOINT_ROOT_URI
 *
 * This constant defines the root URI for the API.
 *************************************************************************************************/
export const WASH_ENDPOINT_ROOT_URI = 'https://jumper-wash.builtby.dad';

/**************************************************************************************************
 * Default NFT color
 *
 * This constant defines the default color for NFTs. Useful for the placeholder.
 *************************************************************************************************/
export const DEFAULT_NFT_COLOR: TColor = 'violet';

/**************************************************************************************************
 * getItem is needed here because cleaning items have different stroke colors depends on UI place.
 *************************************************************************************************/
export const getItem = (id: keyof typeof CLEANING_ITEMS, color?: string) => {
  return {
    ...CLEANING_ITEMS[id],
    logo: color ? `/wash/${color}-stroke-${id}.png` : CLEANING_ITEMS[id].logo,
  };
};

/**************************************************************************************************
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
    maxAmount: 20,
  },
  sponge: {
    id: 'sponge',
    message: 'I am using one sponge',
    logo: '/wash/violet-stroke-sponge.png',
    percentage: '+10%',
    boost: 10,
    maxAmount: 10,
  },
  cleanser: {
    id: 'cleanser',
    message: 'I am using one cleanser',
    logo: '/wash/violet-stroke-cleanser.png',
    percentage: '+15%',
    boost: 15,
    maxAmount: 7,
  },
};

/**************************************************************************************************
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
    sendingToken: ['JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'], // JUP
    receivingToken: ['11111111111111111111111111111111'], // SOL
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
    sendingToken: [
      'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
      '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
    ], // WIF POPCAT
    receivingToken: [
      '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
      'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    ], // POPCAT WIF
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
    sendingToken: [
      '11111111111111111111111111111111',
      '3S8qX1MsMqRbiwKg2cQyx7nis1oHMgaCuc9c4VfvVdPN',
    ], // SOL MOTHER
    receivingToken: [
      '3S8qX1MsMqRbiwKg2cQyx7nis1oHMgaCuc9c4VfvVdPN',
      '11111111111111111111111111111111',
    ], // MOTHER SOL
  },
  {
    id: 'quest4',
    order: 4,
    questType: 'common',
    title: 'Swap between $USDC & $USDT',
    description: 'The real authentic washtrading experience… snore.',
    progressSteps: 5,
    powerUp: getItem('soap', 'pink'),
    sendingToken: [
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    ], // USDC USDT
    receivingToken: [
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    ], // USDT USDC
  },
  {
    id: 'quest5',
    order: 5,
    questType: 'rare',
    title: 'Swap between $SOL & $DRIFT',
    description:
      'Get your Drift on and acquire some tokens from our good friends at Drift.',
    progressSteps: 5,
    powerUp: getItem('sponge', 'blue'),
    sendingToken: [
      '11111111111111111111111111111111',
      'DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7',
    ], // SOL DRIFT
    receivingToken: [
      'DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7',
      '11111111111111111111111111111111',
    ], // DRIFT SOL
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
    sendingToken: ['FU1q8vJpZNUrmqsciSjp8bAKKidGsLmouB8CBdf8TKQv'], // TREMP
    receivingToken: ['3psH1Mj1f7yUfaD5gh6Zj7epE8hhrMkMETgv5TshQA4o'], // BODEN
  },
  {
    id: 'quest7',
    order: 7,
    questType: 'common',
    title: 'Swap between $WIF, $MICHI, or $MEW',
    description:
      'This quest gets you to trade Ansem tokens, in the hope that he’ll engage with us. Can’t hurt… right?',
    progressSteps: 5,
    powerUp: getItem('soap', 'pink'),
    sendingToken: [
      'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
      '5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp',
      'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
    ], // WIF MICHI MEW
    receivingToken: [
      '5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp',
      'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
      'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
    ], // MICHI WIF MEW
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
    sendingToken: [
      'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY',
      'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump',
    ], // MOODENG FWOG
    receivingToken: [
      'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY',
      'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump',
    ], // MOODENG FWOG
  },
  {
    id: 'quest9',
    order: 9,
    questType: 'common',
    title: 'Swap between $Trump and $USA',
    description:
      'Play some Bruce Springsteen, put on your Maga hat and start trading like a true patriot. Murica mfer!',
    progressSteps: 5,
    powerUp: getItem('soap', 'pink'),
    sendingToken: [
      'HaP8r3ksG76PhQLTqR8FYBeNiQpejcFbQmiHbg787Ut1',
      '69kdRLyP5DTRkpHraaSZAQbWmAwzF9guKjZfzMXzcbAs',
    ], // TRUMP USA
    receivingToken: [
      '69kdRLyP5DTRkpHraaSZAQbWmAwzF9guKjZfzMXzcbAs',
      'HaP8r3ksG76PhQLTqR8FYBeNiQpejcFbQmiHbg787Ut1',
    ], // USA TRUMP
  },
  {
    id: 'quest11',
    order: 11,
    questType: 'common',
    title: 'Dump $USDC for $COBY',
    description: 'Sell some USDC for Coby. Who needs stablecoins anyway!',
    progressSteps: 5,
    powerUp: getItem('soap', 'pink'),
    sendingToken: [
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      '8WnQQRbuEZ3CCDbH5MCVioBbw6o75NKANq9WdPhBDsWo',
    ], // USDC coby
    receivingToken: [
      '8WnQQRbuEZ3CCDbH5MCVioBbw6o75NKANq9WdPhBDsWo',
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    ], // coby USDC
  },
  {
    id: 'quest12',
    order: 12,
    questType: 'common',
    title: 'Trade $SOL for $USDC',
    description:
      'Enjoy the classic washtrading pair, and join in our partner’s OKAYBEARS movember campaign.',
    progressSteps: 5,
    powerUp: getItem('soap', 'pink'),
    sendingToken: [
      '11111111111111111111111111111111',
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    ], // SOL USDC
    receivingToken: [
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      '11111111111111111111111111111111',
    ], // USDC SOL
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
    'Complete quests to gain power ups, and use them to super charge your wash trading progress.',
  progress:
    'Every swap helps wash your NFT clean. It takes $10,000 of volume to fully wash the NFT, or you can complete quests for power ups to boost your progress much faster!',
  quest:
    'Quests help speed up your wash trading progress. Trade at least $10 of volume per quest to gain power ups that boost your progress! Lfg.',
  goldenNft:
    //TODO: change this on launch
    'When the game ends on xx/xx/xxxx Golden NFT holders will be airdropped something sexy from the prize pool; holding Mad Lads, Retardio Cousins, Degods, Yoots, $Coby, and more!',
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

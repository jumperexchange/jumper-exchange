import type { LucideIcon } from 'lucide-react';
import { ScrollTextIcon, VaultIcon } from 'lucide-react';
import type { z } from 'zod';
import { create } from 'zustand';

export type MarketBuilderSteps = {
  [key: string]: {
    id: string;
    label: string;
    title: string;
    index: number;
  };
};

export const ActionTypeMap: Record<
  number,
  {
    index: number;
    id: string;
    label: string;
    tag: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  0: {
    index: 1,
    id: 'recipe',
    label: 'Recipe Market',
    tag: '',
    description:
      'Offer incentives to perform any onchain transaction or series of transactions. Best for actions with lump sum rewards and timelocks."',
    icon: ScrollTextIcon,
  },
  1: {
    index: 2,
    id: 'vault',
    label: 'Vault Market',
    tag: '',
    description:
      'Offer incentives to deposit into an underlying ERC4626 Vault. Best for streaming rewards pro-rated to depositors and for actions easily represented by a 4646 vault.',
    icon: VaultIcon,
  },
};

export const RewardStyleMap: Record<
  number,
  {
    id: string;
    label: string;
    tag: string;
    description: string;
  }
> = {
  0: {
    id: 'upfront',
    label: 'Upfront',
    tag: '',
    description: 'Pay all incentives at the completion of action.',
  },
  1: {
    id: 'arrear',
    label: 'Arrear',
    tag: '',
    description:
      "Lock Action Provider's assets and pay incentives once unlocked.",
  },
  2: {
    id: 'forfeitable',
    label: 'Forfeitable',
    tag: '',
    description:
      "Lock Action Provider's assets and stream incentives, which are forfeited if withdrawn early.",
  },
};

/**
 * @description Current Market Builder Steps
 */
export const MarketBuilderSteps: MarketBuilderSteps = {
  info: {
    id: 'info',
    label: 'Info',
    title: 'Step 1: Create Market',
    index: 1,
  },
  actions: {
    id: 'actions',
    label: 'Actions',
    title: 'Step 2.1: Incentive Actions',
    index: 2,
  },
  params: {
    id: 'params',
    label: 'Params',
    title: 'Step 2.2: Action Params',
    index: 4,
  },
  vault: {
    id: 'vault',
    label: 'Vault',
    title: 'Step 2: Configure 4626 Vault',
    index: 3,
  },
  review: {
    id: 'review',
    label: 'Review',
    title: 'Step 3: Review',
    index: 5,
  },
  transaction: {
    id: 'transaction',
    label: 'Transaction',
    title: 'Step 4: Transaction',
    index: 6,
  },
};

export const ActionsTypeMap: Record<
  ActionsType,
  { id: ActionsType; label: string }
> = {
  enter_actions: {
    id: 'enter_actions',
    label: 'Enter Market',
  },
  exit_actions: {
    id: 'exit_actions',
    label: 'Exit Market',
  },
};

export type ActionsType = 'enter_actions' | 'exit_actions';

export interface UseMarketBuilderManager {
  activeStep: string;
  setActiveStep: (activeStep: string) => void;

  lastActiveStep: string;
  setLastActiveStep: (lastActiveStep: string) => void;

  lastActiveSteps: string[];
  setLastActiveSteps: (lastActiveSteps: string[]) => void;

  forceClose: boolean;
  setForceClose: (forceClose: boolean) => void;

  actionsType: ActionsType;
  setActionsType: (actions_type: ActionsType) => void;

  draggingKey: string | null;
  setDraggingKey: (draggingKey: string | null) => void;

  reviewActionsType: ActionsType;
  setReviewActionsType: (reviewActionsType: ActionsType) => void;

  isMarketBuilderSubmitted: boolean;
  setIsMarketBuilderSubmitted: (isMarketBuilderSubmitted: boolean) => void;

  marketBuilderForm: any;
  setMarketBuilderForm: (marketForm: any) => void;

  isContractAddressUpdated: boolean;
  setIsContractAddressUpdated: (contractAddressUpdated: boolean) => void;

  isContractAbiUpdated: boolean;
  setIsContractAbiUpdated: (contractAbiUpdated: boolean) => void;
}

export const useMarketBuilderManager = create<UseMarketBuilderManager>(
  (set) => ({
    // activeStep: MarketBuilderSteps.transaction.id,
    activeStep: MarketBuilderSteps.info.id, // default start step
    setActiveStep: (activeStep: string) => set({ activeStep }),

    lastActiveStep: '',
    setLastActiveStep: (lastActiveStep: string) => set({ lastActiveStep }),

    lastActiveSteps: ['', ''],
    setLastActiveSteps: (lastActiveSteps: string[]) => set({ lastActiveSteps }),

    forceClose: false,
    setForceClose: (forceClose: boolean) => set({ forceClose }),

    actionsType: 'enter_actions',
    setActionsType: (actionsType: ActionsType) =>
      set({ actionsType: actionsType }),

    draggingKey: null,
    setDraggingKey: (draggingKey: string | null) => set({ draggingKey }),

    reviewActionsType: 'enter_actions',
    setReviewActionsType: (reviewActionsType: ActionsType) =>
      set({ reviewActionsType }),

    isMarketBuilderSubmitted: false,
    setIsMarketBuilderSubmitted: (isMarketBuilderSubmitted: boolean) =>
      set({ isMarketBuilderSubmitted }),

    marketBuilderForm: undefined,
    setMarketBuilderForm: (marketBuilderForm: any) =>
      set({ marketBuilderForm }),

    isContractAddressUpdated: false,
    setIsContractAddressUpdated: (isContractAddressUpdated: boolean) =>
      set({ isContractAddressUpdated }),

    isContractAbiUpdated: false,
    setIsContractAbiUpdated: (isContractAbiUpdated: boolean) =>
      set({ isContractAbiUpdated }),
  }),
);

// ----------------------------------------------------------------------

// create PDA type
export interface PDA {}

export interface LoyaltyPassProps {
  address?: string;
  points?: number;
  tier?: string;
  pdas?: PDA[];
  time?: number;
  [key: string]: any;
}

export interface LoyaltyPassState extends LoyaltyPassProps {
  storeLoyaltyPassData: (
    address: string,
    points: number,
    tier: string,
    pdas: PDA[],
    time: number,
  ) => void;
}

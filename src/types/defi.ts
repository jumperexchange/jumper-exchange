import { Protocol } from './jumper-backend';

export interface MinimalDeFiPosition extends Protocol {
  balance: number;
  totalPriceUSD: number;
  relatedProtocols?: Omit<MinimalDeFiPosition, 'relatedProtocols'>[];
}

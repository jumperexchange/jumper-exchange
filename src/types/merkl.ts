import { type MerklApi } from '@merkl/api';
import { type MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import type { QuestData } from './strapi';

export type MerklApi = typeof MerklApi;

export interface QuestDataExtended extends QuestData {
  opportunities?: MerklOpportunity[];
  maxApy?: number;
}

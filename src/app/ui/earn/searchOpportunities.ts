import lunr from 'lunr';
import type { ChainId, ExtendedChain } from '@lifi/sdk';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { getChainName } from '@/utils/chains/getChainName';

type GetChainByIdFn = (id: ChainId) => ExtendedChain | undefined;

export interface EarnSearchIndex {
  /** Returns the slugs of opportunities matching every term in `query`. */
  search: (query: string) => Set<string>;
}

const EMPTY_INDEX: EarnSearchIndex = {
  search: () => new Set(),
};

// Wildcards and pipeline chars have special meaning to lunr's query parser;
// strip them from user input so a raw substring search always "just works".
const sanitizeTerm = (term: string) => term.replace(/[*:^~+-]/g, '');

export function buildEarnSearchIndex(
  items: EarnOpportunityWithLatestAnalytics[],
  getChainById: GetChainByIdFn,
): EarnSearchIndex {
  if (items.length === 0) {
    return EMPTY_INDEX;
  }

  const index = lunr(function () {
    this.ref('slug');
    this.field('name');
    this.field('protocol');
    this.field('chain');
    // Names/tickers (e.g. "USDC", "Spark") aren't English prose; stemming
    // them would only cause false negatives.
    this.pipeline.remove(lunr.stemmer);
    this.searchPipeline.remove(lunr.stemmer);

    for (const item of items) {
      this.add({
        slug: item.slug,
        name: item.name,
        protocol: [item.protocol.name, item.protocol.product]
          .filter(Boolean)
          .join(' '),
        chain: [
          getChainName(item.asset.chain, getChainById),
          getChainName(item.lpToken.chain, getChainById),
        ]
          .filter(Boolean)
          .join(' '),
      });
    }
  });

  return {
    search: (query: string) => {
      const terms = query.trim().split(/\s+/).map(sanitizeTerm).filter(Boolean);

      if (terms.length === 0) {
        return new Set();
      }

      const results = index.query((q) => {
        for (const term of terms) {
          // Every term must match (AND), so combined queries like "morpho
          // base" narrow down rather than broaden the results; wildcards on
          // both ends give case-insensitive, partial/substring matching.
          q.term(term.toLowerCase(), {
            presence: lunr.Query.presence.REQUIRED,
            wildcard:
              lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
            usePipeline: false,
          });
        }
      });

      return new Set(results.map((result) => result.ref));
    },
  };
}

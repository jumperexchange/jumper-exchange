import { orderBy } from 'lodash';
import type { EarnOpportunityFilterWithoutSortByAndOrder } from 'src/app/ui/earn/types';

export const EarnSearchCategory = {
  Pool: 'pool',
  Chain: 'chain',
  Protocol: 'protocol',
} as const;

export type EarnSearchCategoryEnum =
  (typeof EarnSearchCategory)[keyof typeof EarnSearchCategory];

// Fixed display order (rather than alphabetical by category) so filtered
// results stay grouped consistently regardless of what matched.
const CATEGORY_ORDER: Record<EarnSearchCategoryEnum, number> = {
  [EarnSearchCategory.Pool]: 0,
  [EarnSearchCategory.Chain]: 1,
  [EarnSearchCategory.Protocol]: 2,
};

const MAX_OPTIONS_PER_CATEGORY = 5;

export interface EarnSearchOption {
  category: EarnSearchCategoryEnum;
  value: string;
  label: string;
}

const optionId = (option: Pick<EarnSearchOption, 'category' | 'value'>) =>
  `${option.category}:${option.value}`;

/** Derives the currently-selected options from the active filter, so the
 * autocomplete's chips stay in sync with chains/protocols/pools set anywhere
 * else (e.g. the existing dropdown filters). */
export function buildSelectedOptions<T extends EarnSearchOption>(
  options: T[],
  filter: Pick<
    EarnOpportunityFilterWithoutSortByAndOrder,
    'chains' | 'protocols' | 'pools'
  >,
): T[] {
  const selectedIds = new Set([
    ...(filter.chains ?? []).map((id) =>
      optionId({ category: EarnSearchCategory.Chain, value: String(id) }),
    ),
    ...(filter.protocols ?? []).map((protocol) =>
      optionId({ category: EarnSearchCategory.Protocol, value: protocol }),
    ),
    ...(filter.pools ?? []).map((slug) =>
      optionId({ category: EarnSearchCategory.Pool, value: slug }),
    ),
  ]);

  return options.filter((option) => selectedIds.has(optionId(option)));
}

export interface EarnSearchFilterPatch {
  chains: number[] | null;
  protocols: string[] | null;
  pools: string[] | null;
}

/** Splits the autocomplete's flat multi-select value back into the
 * structured filter fields the rest of the filtering context understands. */
export function partitionSelectedOptions(
  selected: EarnSearchOption[],
): EarnSearchFilterPatch {
  const byCategory = (category: EarnSearchCategoryEnum) =>
    selected.filter((option) => option.category === category);

  const chains = byCategory(EarnSearchCategory.Chain).map((option) =>
    Number(option.value),
  );
  const protocols = byCategory(EarnSearchCategory.Protocol).map(
    (option) => option.value,
  );
  const pools = byCategory(EarnSearchCategory.Pool).map(
    (option) => option.value,
  );

  return {
    chains: chains.length ? chains : null,
    protocols: protocols.length ? protocols : null,
    pools: pools.length ? pools : null,
  };
}

/** Case-insensitive substring match, grouped by category (kept contiguous
 * for MUI's `groupBy`) and ranked prefix-first within each group. Returns []
 * for an empty/blank query so the autocomplete stays closed until the user
 * types, rather than dumping every option. */
function rankMatches<T extends EarnSearchOption>(
  options: T[],
  inputValue: string,
): T[] {
  const input = inputValue.trim().toLowerCase();
  if (!input) {
    return [];
  }

  const matches = options.filter((option) =>
    option.label.toLowerCase().includes(input),
  );

  return orderBy(
    matches,
    [
      (option) => CATEGORY_ORDER[option.category],
      (option) => (option.label.toLowerCase().startsWith(input) ? 0 : 1),
      (option) => option.label.toLowerCase(),
    ],
    ['asc', 'asc', 'asc'],
  );
}

/** Matches per category, capped so a single category can't crowd out the
 * others. */
export function filterSearchOptions<T extends EarnSearchOption>(
  options: T[],
  inputValue: string,
): T[] {
  const ranked = rankMatches(options, inputValue);

  const countPerCategory = new Map<EarnSearchCategoryEnum, number>();
  return ranked.filter((option) => {
    const count = countPerCategory.get(option.category) ?? 0;
    if (count >= MAX_OPTIONS_PER_CATEGORY) {
      return false;
    }
    countPerCategory.set(option.category, count + 1);
    return true;
  });
}

/** Count of matches hidden by the per-category cap, so the UI can surface a
 * "+N more" hint per group. */
export function getHiddenCountByCategory<T extends EarnSearchOption>(
  options: T[],
  inputValue: string,
): Record<EarnSearchCategoryEnum, number> {
  const ranked = rankMatches(options, inputValue);

  const countPerCategory = new Map<EarnSearchCategoryEnum, number>();
  for (const option of ranked) {
    countPerCategory.set(
      option.category,
      (countPerCategory.get(option.category) ?? 0) + 1,
    );
  }

  return Object.fromEntries(
    Object.values(EarnSearchCategory).map((category) => {
      const matchCount = countPerCategory.get(category) ?? 0;
      return [category, Math.max(0, matchCount - MAX_OPTIONS_PER_CATEGORY)];
    }),
  ) as Record<EarnSearchCategoryEnum, number>;
}

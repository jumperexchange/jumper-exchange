import { findChain } from '@/utils/chains/findChain';

const resolveChainName = (value: unknown): string => {
  const id = Number(value);
  return Number.isFinite(id) ? (findChain(id)?.name ?? String(value)) : '';
};

/**
 * i18next formatter resolving a single EVM chain id to its brand name, e.g.
 * `{{chainId, chainNameExt}}` → "Polygon". Chain names are not translated.
 */
export const chainNameFormatter = () => (value: unknown) =>
  resolveChainName(value);

/**
 * i18next formatter resolving an array of chain ids to a joined list of brand
 * names, e.g. `{{chainIds, chainNamesExt}}` → "Polygon, OP Mainnet". The
 * separator can be overridden via the format option `separator`.
 */
export const chainNamesFormatter =
  (_lng: string | undefined, options: { separator?: string } = {}) =>
  (value: unknown) => {
    if (!Array.isArray(value)) {
      return '';
    }
    return value.map(resolveChainName).join(options.separator ?? ', ');
  };

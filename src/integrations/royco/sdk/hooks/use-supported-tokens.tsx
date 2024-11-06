import { type SupportedToken, SupportedTokenList } from '../constants';

export const useSupportedTokens = ({
  chain_id,
  page = 1,
  search = '',
  token_ids,
}: {
  chain_id?: number;
  page?: number;
  search?: string;
  token_ids?: string[] | undefined | null;
} = {}) => {
  const PAGE_SIZE = 20;

  let filteredTokens = SupportedTokenList.filter(
    chain_id ? (token) => token.chain_id === chain_id : () => true,
  );

  if (!!search && search.length > 0) {
    const searchTerm = search.toLowerCase();
    filteredTokens = filteredTokens.filter(
      (token) =>
        token.symbol.toLowerCase().startsWith(searchTerm) ||
        token.name.toLowerCase().includes(searchTerm) ||
        token.contract_address.toLowerCase().includes(searchTerm),
    );
  }

  if (!!token_ids) {
    filteredTokens = filteredTokens.filter((token) =>
      token_ids.includes(token.id),
    );
  }

  const totalPages = Math.ceil(filteredTokens.length / PAGE_SIZE);

  const data = filteredTokens
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    data,
    totalPages,
    currentPage: page,
  };
};

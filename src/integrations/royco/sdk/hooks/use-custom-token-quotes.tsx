import { useQuery } from "@tanstack/react-query";
import { getCustomTokenQuotesQueryOptions } from "../queries";
import { RoycoClient, useRoycoClient } from "../client";

export const useCustomTokenQuotes = ({
  token_data,
  enabled = true,
}: {
  token_data: Array<{
    token_id: string;
    price?: string;
    fdv?: string;
    total_supply?: string;
  }>;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getCustomTokenQuotesQueryOptions(client, token_data),
    enabled,
  });
};

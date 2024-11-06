import { useContext } from 'react';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { RoycoContext } from '../provider';
import type { Database } from '../types/data';

type TypedRoycoClient = SupabaseClient<Database>;
type RoycoClient = TypedRoycoClient;

let typedRoycoClient: TypedRoycoClient;
let roycoClient: RoycoClient;

const useRoycoClient = (): RoycoClient => {
  const { originUrl, originKey } = useContext<{
    originUrl: string;
    originKey: string;
  }>(RoycoContext);

  if (roycoClient) {
    return roycoClient;
  }

  roycoClient = createBrowserClient<Database>(originUrl, originKey);

  typedRoycoClient = roycoClient as TypedRoycoClient;

  return roycoClient;
};

export { useRoycoClient, roycoClient, typedRoycoClient };
export type { RoycoClient, TypedRoycoClient };

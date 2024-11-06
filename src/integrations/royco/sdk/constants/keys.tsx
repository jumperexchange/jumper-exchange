export const RPC_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: process.env.NEXT_PUBLIC_RPC_API_KEY_1!,
  11155111: process.env.NEXT_PUBLIC_RPC_API_KEY_11155111!,
  42161: process.env.NEXT_PUBLIC_RPC_API_KEY_42161!,
  421614: process.env.NEXT_PUBLIC_RPC_API_KEY_421614!,
  8453: process.env.NEXT_PUBLIC_RPC_API_KEY_8453!,
  84532: process.env.NEXT_PUBLIC_RPC_API_KEY_84532!,
};

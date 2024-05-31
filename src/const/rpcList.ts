const optRPCList = [
  'https://mainnet.optimism.io',
  'https://op-pokt.nodies.app',
  'https://optimism.llamarpc.com',
  'https://optimism.drpc.org',
  'https://optimism.meowrpc.com',
];

const arbRPCList = [
  'https://arb1.arbitrum.io/rpc',
  'https://arbitrum.drpc.org',
  'https://arbitrum.llamarpc.com',
  'https://arb-pokt.nodies.app',
  'https://arbitrum.meowrpc.com',
];

const basRPCList = [
  'https://mainnet.base.org/',
  'https://base.llamarpc.com',
  'https://base.meowrpc.com',
  'https://base.drpc.org',
  'https://base-pokt.nodies.app',
];

export const publicRPCList = {
  '10': shuffleArray(optRPCList),
  '42161': shuffleArray(arbRPCList),
  '8453': shuffleArray(basRPCList),
};

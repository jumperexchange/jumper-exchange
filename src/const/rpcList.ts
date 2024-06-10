import { shuffleArray } from 'src/utils/shuffleArray';

const optRPCList = [
  'https://mainnet.optimism.io',
  'https://op-pokt.nodies.app',
  // 'https://optimism.drpc.org',
  `https://lb.drpc.org/ogrpc?network=optimism&dkey=${process.env.NEXT_PUBLIC_DKEY}`,
  'https://optimism.meowrpc.com',
];

const arbRPCList = [
  'https://arb1.arbitrum.io/rpc',
  // 'https://arbitrum.drpc.org',
  `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${process.env.NEXT_PUBLIC_DKEY}`,
  'https://arb-pokt.nodies.app',
  'https://arbitrum.meowrpc.com',
];

const basRPCList = [
  'https://mainnet.base.org/',
  'https://base.meowrpc.com',
  // 'https://base.drpc.org',
  `https://lb.drpc.org/ogrpc?network=base&dkey=${process.env.NEXT_PUBLIC_DKEY}`,
  'https://base-pokt.nodies.app',
];

export const publicRPCList = {
  '10': shuffleArray(optRPCList),
  '42161': shuffleArray(arbRPCList),
  '8453': shuffleArray(basRPCList),
};

import { ContractNames, getContractAbi } from '@etherspot/contracts'

export const stakeKlimaAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_staking', type: 'address' },
      { internalType: 'address', name: '_KLIMA', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'KLIMA',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'staking',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
]
export const erc20Abi = getContractAbi(ContractNames.ERC20Token)

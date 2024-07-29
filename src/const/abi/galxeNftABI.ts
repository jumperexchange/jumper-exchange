export const GalxeNFTABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_cid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_dummyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_nftID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
    ],
    name: 'EventClaim',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_cid',
        type: 'uint256',
      },
      {
        internalType: 'contract IStarNFT',
        name: '_starNFT',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_dummyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_powah',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_mintTo',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_cid',
        type: 'uint256',
      },
      {
        internalType: 'contract IStarNFT',
        name: '_starNFT',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_dummyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_powah',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_cap',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_mintTo',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'claimCapped',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'campaignFeeConfigs',
    outputs: [
      {
        internalType: 'address',
        name: 'erc20',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'erc20Fee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'platformFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'numMinted',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

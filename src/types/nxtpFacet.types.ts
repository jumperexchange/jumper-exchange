export const lifi_abi = [
  {
    inputs: [
      {
        internalType: "contract ITransactionManager",
        name: "_txMgrAddr",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "router",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "transactionId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "address",
            name: "receivingChainTxManagerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "sendingAssetId",
            type: "address",
          },
          {
            internalType: "address",
            name: "receivingAssetId",
            type: "address",
          },
          {
            internalType: "address",
            name: "sendingChainFallback",
            type: "address",
          },
          {
            internalType: "address",
            name: "receivingAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "callTo",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "callDataHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "sendingChainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "receivingChainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "preparedBlockNumber",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct ITransactionManager.TransactionData",
        name: "txData",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "encryptedCallData",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "encodedBid",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "bidSignature",
        type: "bytes",
      },
    ],
    name: "NXTPBridgeStarted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "assetId",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "completeBridgeTokensViaNXTP",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getNXTPTransactionManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "receivingChainTxManagerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "sendingAssetId",
            type: "address",
          },
          {
            internalType: "address",
            name: "receivingAssetId",
            type: "address",
          },
          {
            internalType: "address",
            name: "sendingChainFallback",
            type: "address",
          },
          {
            internalType: "address",
            name: "receivingAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "callTo",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "sendingChainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "receivingChainId",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "callDataHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "encryptedCallData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "encodedBid",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "bidSignature",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
        ],
        internalType: "struct NXTPFacet.NXTPData",
        name: "_nxtpData",
        type: "tuple",
      },
    ],
    name: "startBridgeTokensViaNXTP",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "fromToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "toToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "callTo",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "fromAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "toAmount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct LibLiFi.SwapData[]",
        name: "_swapData",
        type: "tuple[]",
      },
      {
        internalType: "address",
        name: "finalAssetId",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      // optional:
      // {
      //   internalType: "uint256",
      //   name: "amount",
      //   type: "uint256",
      // },
    ],
    name: "swapAndCompleteBridgeTokensViaNXTP",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "fromToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "toToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "callTo",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "fromAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "toAmount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct LibLiFi.SwapData[]",
        name: "_swapData",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "address",
            name: "receivingChainTxManagerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "sendingAssetId",
            type: "address",
          },
          {
            internalType: "address",
            name: "receivingAssetId",
            type: "address",
          },
          {
            internalType: "address",
            name: "sendingChainFallback",
            type: "address",
          },
          {
            internalType: "address",
            name: "receivingAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "callTo",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "sendingChainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "receivingChainId",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "callDataHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "encryptedCallData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "encodedBid",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "bidSignature",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
        ],
        internalType: "struct NXTPFacet.NXTPData",
        name: "_nxtpData",
        type: "tuple",
      },
    ],
    name: "swapAndStartBridgeTokensViaNXTP",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
]

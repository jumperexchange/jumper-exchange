const CALL_COMPONENTS = [
  { name: 'to', type: 'address' },
  { name: 'data', type: 'bytes' },
  { name: 'value', type: 'uint256' },
  { name: 'skipRevert', type: 'bool' },
  { name: 'callbackHash', type: 'bytes32' },
] as const;

export const CALL_ARRAY_ABI_PARAM = {
  name: 'bundle',
  type: 'tuple[]',
  components: CALL_COMPONENTS,
} as const;

export const BUNDLER3_ABI = [
  {
    type: 'function',
    name: 'multicall',
    stateMutability: 'payable',
    inputs: [CALL_ARRAY_ABI_PARAM],
    outputs: [],
  },
  {
    type: 'function',
    name: 'reenter',
    stateMutability: 'nonpayable',
    inputs: [CALL_ARRAY_ABI_PARAM],
    outputs: [],
  },
] as const;

const MARKET_PARAMS = [
  { name: 'loanToken', type: 'address' },
  { name: 'collateralToken', type: 'address' },
  { name: 'oracle', type: 'address' },
  { name: 'irm', type: 'address' },
  { name: 'lltv', type: 'uint256' },
] as const;

const AUTHORIZATION = [
  { name: 'authorizer', type: 'address' },
  { name: 'authorized', type: 'address' },
  { name: 'isAuthorized', type: 'bool' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
] as const;

const SIGNATURE = [
  { name: 'v', type: 'uint8' },
  { name: 'r', type: 'bytes32' },
  { name: 's', type: 'bytes32' },
] as const;

export const MORPHO_ABI = [
  {
    type: 'function',
    name: 'setAuthorizationWithSig',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'authorization', type: 'tuple', components: AUTHORIZATION },
      { name: 'signature', type: 'tuple', components: SIGNATURE },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'nonce',
    stateMutability: 'view',
    inputs: [{ name: 'authorizer', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const GENERAL_ADAPTER_1_ABI = [
  {
    type: 'function',
    name: 'permit2TransferFrom',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'erc20Transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'morphoSupplyCollateral',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'marketParams', type: 'tuple', components: MARKET_PARAMS },
      { name: 'assets', type: 'uint256' },
      { name: 'onBehalf', type: 'address' },
      { name: 'data', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'morphoBorrow',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'marketParams', type: 'tuple', components: MARKET_PARAMS },
      { name: 'assets', type: 'uint256' },
      { name: 'shares', type: 'uint256' },
      { name: 'minSharePriceE27', type: 'uint256' },
      { name: 'receiver', type: 'address' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'morphoFlashLoan',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'assets', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    outputs: [],
  },
] as const;

export const PERMIT2_ABI = [
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint48' },
    ],
  },
  {
    type: 'function',
    name: 'permit',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'owner', type: 'address' },
      {
        name: 'permitSingle',
        type: 'tuple',
        components: [
          {
            name: 'details',
            type: 'tuple',
            components: [
              { name: 'token', type: 'address' },
              { name: 'amount', type: 'uint160' },
              { name: 'expiration', type: 'uint48' },
              { name: 'nonce', type: 'uint48' },
            ],
          },
          { name: 'spender', type: 'address' },
          { name: 'sigDeadline', type: 'uint256' },
        ],
      },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
  },
] as const;

export const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const LOOPOOR_SWAP_ADAPTER_ABI = [
  {
    type: 'function',
    name: 'swapAndForward',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'tokenOut', type: 'address' },
      { name: 'tokenSpender', type: 'address' },
      { name: 'router', type: 'address' },
      { name: 'routerCalldata', type: 'bytes' },
      { name: 'receiver', type: 'address' },
    ],
    outputs: [],
  },
] as const;

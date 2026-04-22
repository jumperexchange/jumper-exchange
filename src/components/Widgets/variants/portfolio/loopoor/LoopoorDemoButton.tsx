'use client';

import { getLoopoorMarket } from '@/app/lib/getLoopoorMarket';
import { getLoopoorStats } from '@/app/lib/getLoopoorStats';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { type Address, encodeFunctionData, type Hex, parseUnits } from 'viem';
import {
  useSendTransaction,
  useSignTypedData,
  useSwitchChain,
  usePublicClient,
} from 'wagmi';
import { ERC20_ABI, MORPHO_ABI, PERMIT2_ABI } from './abis';
import { buildLoopoorMulticall } from './build-transaction';
import {
  getLoopoorChainConfig,
  MAX_UINT256,
  PERMIT2_ADDRESS,
  ZERO_ADDRESS,
} from './constants';
import { fetchLoopoorLifiQuote } from './lifi-quote';
import { toMorphoMarketParams } from './market-params';
import {
  buildMorphoAuthorizationTypedData,
  buildPermit2TypedData,
  splitMorphoSignature,
} from './signatures';

// Demo constants — wstETH/msETH market on Base at 2× leverage with 0.001 wstETH.
const CHAIN_ID = 8453;
const MARKET_ID =
  '0xffd35206a772174c04f599e4034a2f132fc3f7a462ca732affcea92136716573';
const INITIAL_COLLATERAL = parseUnits('0.001', 18);
const LEVERAGE_FACTOR = 2;
const SLIPPAGE = 0.005;
const SAFETY_BUFFER = 0.95;
const SIGNATURE_TTL_SECONDS = 3600;

type Status =
  | { kind: 'idle' }
  | { kind: 'running'; step: string }
  | { kind: 'done'; txHash: Hex }
  | { kind: 'error'; message: string };

export function LoopoorDemoButton() {
  const user = useAccountAddress();
  const publicClient = usePublicClient({ chainId: CHAIN_ID });
  const { mutateAsync: switchChain } = useSwitchChain();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { mutateAsync: signTypedData } = useSignTypedData();

  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const isBusy = status.kind === 'running';
  const chainConfig = getLoopoorChainConfig(CHAIN_ID);

  async function run() {
    if (!user) {
      setStatus({ kind: 'error', message: 'Connect an EVM wallet first.' });
      return;
    }
    if (!publicClient) {
      setStatus({
        kind: 'error',
        message: 'No public client for Base — check wagmi config.',
      });
      return;
    }
    if (chainConfig.swapAdapter === ZERO_ADDRESS) {
      // Still proceed so we exercise the flow; the simulate step will surface the issue.

      console.warn(
        'LoopoorDemoButton: NEXT_PUBLIC_LOOPOOR_SWAP_ADAPTER_BASE is not set. ' +
          'Simulation will revert at the swap step.',
      );
    }

    try {
      setStatus({ kind: 'running', step: 'Switching to Base…' });
      await switchChain({ chainId: CHAIN_ID });

      setStatus({ kind: 'running', step: 'Loading market data…' });
      const marketRes = await getLoopoorMarket(CHAIN_ID, MARKET_ID);
      // @ts-expect-error
      const market = marketRes.data.data;
      if (!market) {
        throw new Error('Failed to load market');
      }
      const marketParams = toMorphoMarketParams(market);
      const collateralToken = marketParams.collateralToken;
      const loanToken = marketParams.loanToken;

      setStatus({ kind: 'running', step: 'Sizing flash loan…' });
      const statsRes = await getLoopoorStats(CHAIN_ID, MARKET_ID, {
        leverageFactor: LEVERAGE_FACTOR,
        amount: INITIAL_COLLATERAL.toString(),
        slippage: SLIPPAGE,
        safetyBuffer: SAFETY_BUFFER,
      });
      // @ts-expect-error
      const stats = statsRes.data.data;
      if (!stats?.flashLoanAmount) {
        throw new Error('Stats endpoint returned no flashLoanAmount');
      }
      const flashLoanAmount = BigInt(stats.flashLoanAmount);
      const minSharePriceE27 = 0n; // dev guard disabled for the demo

      setStatus({ kind: 'running', step: 'Reading nonces & allowances…' });
      const [morphoNonce, permit2Allowance, erc20Allowance] = await Promise.all(
        [
          publicClient.readContract({
            address: chainConfig.morpho,
            abi: MORPHO_ABI,
            functionName: 'nonce',
            args: [user],
          }),
          publicClient.readContract({
            address: PERMIT2_ADDRESS,
            abi: PERMIT2_ABI,
            functionName: 'allowance',
            args: [user, collateralToken, chainConfig.generalAdapter1],
          }),
          publicClient.readContract({
            address: collateralToken,
            abi: ERC20_ABI,
            functionName: 'allowance',
            args: [user, PERMIT2_ADDRESS],
          }),
        ],
      );
      const [, , permit2Nonce] = permit2Allowance as readonly [
        bigint,
        number,
        number,
      ];

      if (erc20Allowance < INITIAL_COLLATERAL) {
        setStatus({ kind: 'running', step: 'Approving Permit2…' });
        const approveData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [PERMIT2_ADDRESS, MAX_UINT256],
        });
        const approveHash = await sendTransaction({
          to: collateralToken,
          data: approveData,
          value: 0n,
          chainId: CHAIN_ID,
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      setStatus({ kind: 'running', step: 'Fetching LI.FI quote…' });
      const quote = await fetchLoopoorLifiQuote({
        chainId: CHAIN_ID,
        loanToken,
        collateralToken,
        flashLoanAmount,
        adapter: chainConfig.swapAdapter,
        slippage: SLIPPAGE,
      });

      const nowSec = BigInt(Math.floor(Date.now() / 1000));
      const deadline = nowSec + BigInt(SIGNATURE_TTL_SECONDS);

      setStatus({ kind: 'running', step: 'Signing Morpho authorization…' });
      const morphoTypedData = buildMorphoAuthorizationTypedData({
        chainId: CHAIN_ID,
        user,
        nonce: morphoNonce as bigint,
        deadline,
      });
      const morphoSigHex = (await signTypedData({
        domain: morphoTypedData.domain,
        types: morphoTypedData.types,
        primaryType: morphoTypedData.primaryType,
        message: morphoTypedData.message,
      })) as Hex;
      const morphoSig = splitMorphoSignature(morphoSigHex);

      setStatus({ kind: 'running', step: 'Signing Permit2…' });
      const permit2TypedData = buildPermit2TypedData({
        chainId: CHAIN_ID,
        token: collateralToken,
        amount: INITIAL_COLLATERAL,
        expiration: Number(nowSec + BigInt(SIGNATURE_TTL_SECONDS)),
        nonce: Number(permit2Nonce),
        sigDeadline: deadline,
      });
      const permit2SigHex = (await signTypedData({
        domain: permit2TypedData.domain,
        types: permit2TypedData.types,
        primaryType: permit2TypedData.primaryType,
        message: permit2TypedData.message,
      })) as Hex;

      setStatus({ kind: 'running', step: 'Building bundle…' });
      const { calldata } = buildLoopoorMulticall({
        chainId: CHAIN_ID,
        user: user as Address,
        market: marketParams,
        initialCollateral: INITIAL_COLLATERAL,
        flashLoanAmount,
        minSharePriceE27,
        quote,
        morphoAuth: morphoTypedData.message,
        morphoSig,
        permit2: permit2TypedData.message,
        permit2Sig: permit2SigHex,
      });

      setStatus({ kind: 'running', step: 'Simulating…' });
      try {
        await publicClient.call({
          to: chainConfig.bundler3,
          data: calldata,
          account: user,
          value: 0n,
        });
      } catch (simErr) {
        throw new Error(
          `Simulation reverted: ${simErr instanceof Error ? simErr.message : String(simErr)}`,
        );
      }

      setStatus({ kind: 'running', step: 'Submitting multicall…' });
      const txHash = await sendTransaction({
        to: chainConfig.bundler3,
        data: calldata,
        value: 0n,
        chainId: CHAIN_ID,
      });

      setStatus({ kind: 'done', txHash });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus({ kind: 'error', message });
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button
        onClick={run}
        disabled={isBusy || !user}
        variant="outlined"
        size="small"
      >
        {isBusy ? 'Running demo…' : 'Execute demo leverage loop'}
      </Button>
      <Typography variant="caption" color="text.secondary">
        {renderStatus(status)}
      </Typography>
    </Box>
  );
}

function renderStatus(status: Status): string {
  switch (status.kind) {
    case 'idle':
      return 'Idle. Click to open a 0.001 wstETH @ 2× position on Base.';
    case 'running':
      return status.step;
    case 'done':
      return `Done: ${status.txHash}`;
    case 'error':
      return `Error: ${status.message}`;
  }
}

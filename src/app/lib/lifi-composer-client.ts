import 'server-only';
import config from '@/config/env-config';

interface ERC20Resource {
  kind: 'erc20';
  token: string;
  chainId: number;
}

interface NativeResource {
  kind: 'native';
  chainId: number;
}

type Resource = ERC20Resource | NativeResource;

interface FlowInput {
  name: string;
  resource: Resource;
}

interface SwapNode {
  id: string;
  op: 'lifi.swap';
  bind: {
    amountIn: { $ref: string };
  };
  config: {
    resourceOut: Resource;
    slippage: number;
  };
}

interface Flow {
  version: number;
  id: string;
  chainId: number;
  inputs: FlowInput[];
  nodes: SwapNode[];
}

interface DirectDepositInput {
  kind: 'directDeposit';
  amount: string;
}

interface Run {
  inputs: Record<string, DirectDepositInput>;
  signer: string;
  sweepTo: string;
  simulationPolicy?: string;
  checkOnChainAllowances?: boolean;
  maxPriceImpactBps?: number;
}

interface ComposeRequestBody {
  flow: Flow;
  run: Run;
}

interface TransactionRequest {
  to: string;
  data: string;
  value: string;
}

interface ApprovalItem {
  token: string;
  spender: string;
  amount: string;
  transactionRequest: TransactionRequest;
}

export interface ProducedResourceSimulated {
  amountOut: string;
  amountOutMin: string;
}

export interface ProducedResource {
  kind: 'native' | 'erc20';
  chainId: number;
  availability: string;
  owner: string;
  simulated: ProducedResourceSimulated;
}

export interface PriceImpact {
  inputValueUsd: number;
  outputValueUsd: number;
  impactBps: number;
  unpricedInputs: string[];
  unpricedOutputs: string[];
}

export interface ComposeResponseData {
  producedResources: Record<string, ProducedResource>;
  transactionRequest: TransactionRequest;
  userProxy: string;
  approvals: ApprovalItem[];
  priceImpact: PriceImpact;
}

export interface FailedOp {
  callId: string;
  op: string;
  kind: string;
  message: string;
  path: string;
}

interface ComposeResponse {
  data: ComposeResponseData;
  success: boolean;
  error?: {
    message: string;
    kind: string;
    failedOps?: FailedOp[];
    succeededOps?: string[];
  };
}

class LifiComposerClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async compose(body: ComposeRequestBody): Promise<ComposeResponse> {
    const response = await fetch(`${this.baseUrl}/compose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lifi-api-key': this.apiKey,
      },
      body: JSON.stringify(body),
    });

    return response.json();
  }
}

export const makeLifiComposerClient = (): LifiComposerClient => {
  return new LifiComposerClient(
    config.NEXT_PUBLIC_LIFI_COMPOSER_BACKEND_URL,
    config.LIFI_COMPOSER_API_KEY,
  );
};

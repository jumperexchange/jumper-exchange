import config from '@/config/env-config';
import {
  CheckSweepableTokensDto,
  CheckSweepableTokensResponseDto,
  ExecuteSweepQuoteDto,
  ExecuteSweepQuoteResponseDto,
  HttpResponse,
  SweepQuoteDto,
  SweepQuoteResponseDto,
} from 'src/types/jumper-backend';
import { Hex } from 'viem';

const API_BASE_URL = config.NEXT_PUBLIC_BACKEND_URL;

type TransactionData = {
  message: {
    raw: Hex;
  };
};

class SweepApiService {
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    body?: any,
  ): Promise<T> {
    const url = `${API_BASE_URL}/zaps/${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sweep API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Check for sweepable tokens for a wallet address
   */
  async checkSweepableTokens(request: CheckSweepableTokensDto) {
    return this.makeRequest<
      HttpResponse<CheckSweepableTokensResponseDto, unknown>
    >('check-sweepable-tokens', 'POST', request);
  }

  /**
   * Get sweep quote for a wallet address (only if tokens are available)
   */
  async getSweepQuote(request: SweepQuoteDto) {
    return this.makeRequest<
      HttpResponse<
        SweepQuoteResponseDto & { transactionData: TransactionData },
        unknown
      >
    >('sweep-quote', 'POST', request);
  }

  async executeSweep(request: ExecuteSweepQuoteDto) {
    return this.makeRequest<
      HttpResponse<ExecuteSweepQuoteResponseDto, unknown>
    >('execute-sweep-quote', 'POST', request);
  }
}

// Export singleton instance
export const sweepApiService = new SweepApiService();

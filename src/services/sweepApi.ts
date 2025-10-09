import config from '@/config/env-config';
import {
  CheckSweepableTokensRequest,
  CheckSweepableTokensResponse,
  SweepExecuteRequest,
  SweepExecuteResponse,
  SweepQuoteRequest,
  SweepQuoteResponse,
} from 'src/types/sweep';

const API_BASE_URL = config.NEXT_PUBLIC_BACKEND_URL;

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
  async checkSweepableTokens(
    request: CheckSweepableTokensRequest,
  ): Promise<CheckSweepableTokensResponse> {
    return this.makeRequest<CheckSweepableTokensResponse>(
      'check-sweepable-tokens',
      'POST',
      request,
    );
  }

  /**
   * Get sweep quote for a wallet address (only if tokens are available)
   */
  async getSweepQuote(request: SweepQuoteRequest): Promise<SweepQuoteResponse> {
    return this.makeRequest<SweepQuoteResponse>('sweep-quote', 'POST', request);
  }

  async executeSweep(
    request: SweepExecuteRequest,
  ): Promise<SweepExecuteResponse> {
    return this.makeRequest<SweepExecuteResponse>(
      'execute-sweep-quote',
      'POST',
      request,
    );
  }
}

// Export singleton instance
export const sweepApiService = new SweepApiService();

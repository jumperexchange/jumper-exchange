import { describe, expect, it } from 'vitest';
import {
  errorOperationFromRequestContext,
  parseErrorOperation,
} from '@/utils/telemetry/errorOperations';

describe('parseErrorOperation', () => {
  it('returns known operations unchanged', () => {
    expect(parseErrorOperation('wallet_connect')).toBe('wallet_connect');
  });

  it('returns unknown for invalid values', () => {
    expect(parseErrorOperation('not-a-real-operation')).toBe('unknown');
    expect(parseErrorOperation(null)).toBe('unknown');
  });
});

describe('errorOperationFromRequestContext', () => {
  it('maps Next.js route types to bounded labels', () => {
    expect(errorOperationFromRequestContext('render')).toBe('request_render');
    expect(errorOperationFromRequestContext('route')).toBe('request_route');
    expect(errorOperationFromRequestContext('bogus')).toBe('unknown');
  });
});

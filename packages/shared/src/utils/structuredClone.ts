// Attach the polyfill as a Global function
import structuredClone from '@ungap/structured-clone';
import type { TransferListItem } from 'worker_threads';

if (!('structuredClone' in globalThis)) {
  globalThis.structuredClone = ((
    value: StructuredSerializeOptions | undefined,
    options?: { lossy?: boolean | undefined } | undefined,
  ): StructuredSerializeOptions | undefined =>
    structuredClone(value, options)) as {
    <T = any>(value: T, options?: StructuredSerializeOptions | undefined): T;
    <T>(
      value: T,
      transfer?: { transfer: readonly TransferListItem[] } | undefined,
    ): T;
  };
}

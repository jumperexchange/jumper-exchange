// Attach the polyfill as a Global function
import structuredClone from '@ungap/structured-clone';

if (!('structuredClone' in globalThis)) {
  globalThis.structuredClone = ((
    value: StructuredSerializeOptions | undefined,
    options?: { lossy?: boolean | undefined } | undefined,
  ): StructuredSerializeOptions | undefined =>
    structuredClone(value, options)) as any;
}

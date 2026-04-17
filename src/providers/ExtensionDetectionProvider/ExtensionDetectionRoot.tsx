'use client';

import type { ReactNode } from 'react';

import { ExtensionDetectionProvider } from './ExtensionDetectionProvider';

export function ExtensionDetectionRoot({ children }: { children: ReactNode }) {
  return <ExtensionDetectionProvider>{children}</ExtensionDetectionProvider>;
}

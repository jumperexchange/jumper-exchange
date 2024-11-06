'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { detect } from 'detect-browser';

export const BrowserDetector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  useEffect(() => {
    const browser = detect();

    if (browser) {
      if (browser.name === 'safari' || browser.name === 'ios-webview') {
        useGeneralStats.getState().setBrowserType('webkit');
      }
    }
  }, []);

  return <div ref={ref} className={className} {...props} />;
});

interface GeneralStatsState {
  browserType: string | null;
  setBrowserType: (exploreView: string) => void;
}

export const useGeneralStats = create<GeneralStatsState>((set) => ({
  browserType: null,
  setBrowserType: (browserType: string) => set({ browserType }),
}));

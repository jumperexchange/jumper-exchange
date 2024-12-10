"use client"

import { RoycoProvider } from "royco";
import React from 'react';

export const RoycoClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <RoycoProvider
      originUrl={process.env.NEXT_PUBLIC_ROYCO_URL!}
      originKey={process.env.NEXT_PUBLIC_ROYCO_KEY!}
      originId={process.env.NEXT_PUBLIC_ROYCO_ID!}
    >
      {children}
    </RoycoProvider>
  );
};

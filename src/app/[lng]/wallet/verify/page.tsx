'use client';

import { use } from 'react';
import { WalletHacked } from 'src/components/WalletHacked';

interface Props {
  params: Promise<{
    lng: string;
  }>;
}

export default function WalletVerifyPage({ params }: Props) {
  const { lng } = use(params);
  return <WalletHacked />;
}

'use client';

import { useClientTranslation } from '@/i18n/useClientTranslation';
import { AppProvider } from '@/providers/AppProvider';
import { useState } from 'react';

function PageContent({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useClientTranslation();
  // const { t } = useTranslation();
  const [counter, setCounter] = useState(0);
  return (
    <>
      <p>Test</p>
    </>
  );
}

export default function Page({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  return (
    <AppProvider lng={params.lng}>
      <PageContent params={params}></PageContent>
    </AppProvider>
  );
}

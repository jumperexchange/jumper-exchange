import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';
function Index() {
  const t = useTranslations();

  return (
    <div>
      {/* <LanguageChanger /> */}
      <Button>test</Button>
      <h1>Test: {t('navbar.welcome.title')}</h1>
      <button>Change</button>
    </div>
  );
}

export default Index;

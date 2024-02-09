import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { LanguageChanger } from 'src/components';
function Index() {
  const t = useTranslations();
  // const locale = useLocale();
  // const trans = await getTranslations({ locale, namespace: 'Metadata' });
  // console.log('trans', trans);
  return (
    <div>
      <LanguageChanger />
      <Button>test</Button>
      <h1>Test: {t('navbar.welcome.title')}</h1>
      <button>Change</button>
    </div>
  );
}

export default Index;

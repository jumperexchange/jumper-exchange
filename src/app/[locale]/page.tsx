import {
  FeatureCards,
  PoweredBy,
  Snackbar,
  WelcomeScreen,
  Widgets,
} from 'src/components';
function LocalePage() {
  // const locale = useLocale();
  // const trans = await getTranslations({ locale, namespace: 'Metadata' });
  // console.log('trans', trans);
  return (
    <>
      <WelcomeScreen />
      <Widgets />
      <FeatureCards />
      <PoweredBy />
      <Snackbar />
    </>
  );
}

export default LocalePage;

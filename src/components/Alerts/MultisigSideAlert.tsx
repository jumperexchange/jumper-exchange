import { useTranslation } from 'react-i18next';
import { InfoAlert } from 'src/components';

export const MultisigSideAlert = () => {
  const { t } = useTranslation();
  return (
    <InfoAlert
      active={true}
      title={t('multisig.alert.title')}
      subtitle={t('multisig.alert.description')}
    />
  );
};

import { useTranslation } from 'react-i18next';
import { InfoAlert } from 'src/components';

export const SolanaAlert = () => {
  const { t } = useTranslation();

  return (
    <InfoAlert
      title={t('solanaAlert.title')}
      subtitle={t('solanaAlert.subtitle')}
    />
  );
};

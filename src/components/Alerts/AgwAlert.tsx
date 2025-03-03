import { useTranslation } from 'react-i18next';
import { InfoAlert } from './InfoAlert';

export const AgwAlert = ({ open }: { open: boolean }) => {
  const { t } = useTranslation();

  return (
    <InfoAlert
      active={open}
      bottemLeftPosition={true}
      title={t('agwAlert.title')}
      subtitle={t('agwAlert.subtitle')}
      // autoHeight={true}
    />
  );
};

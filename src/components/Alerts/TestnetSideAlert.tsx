import { useTranslation } from 'react-i18next';
import { InfoAlert } from 'src/components';
import { appendUTMParametersToLink, openInNewTab } from 'src/utils';
import { JUMPER_URL } from 'src/const';

export const TestnetSideAlert = () => {
  const { t } = useTranslation();

  const PROD_URL = appendUTMParametersToLink(JUMPER_URL, {
    utm_medium: 'testnet_banner',
    utm_campaign: 'testnet_to_jumper',
  });

  const handleClick = () => {
    openInNewTab(PROD_URL);
  };

  return (
    <InfoAlert
      active={true}
      title={t('alert.info')}
      subtitle={t('alert.testnet')}
      buttonContent={t('alert.switchToMainnet')}
      handleClick={handleClick}
    />
  );
};

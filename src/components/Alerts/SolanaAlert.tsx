import { ChainId } from '@lifi/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoAlert } from 'src/components';
import { useChainTokenSelectionStore } from 'src/stores';

export const SolanaAlert = () => {
  const { t } = useTranslation();

  return (
    <InfoAlert
      active={true}
      title={t('solanaAlert.title')}
      subtitle={t('solanaAlert.subtitle')}
    />
  );
};

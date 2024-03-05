import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import { Typography } from '@mui/material';
import { useClientTranslation } from 'src/i18n';
import {
  MultisigWalletHeaderAlertContainer,
  MultisigWalletHeaderAlertContent,
  MultisigWalletHeaderAlertTitle,
} from '.';

export const MultisigWalletHeaderAlert = () => {
  const { t } = useClientTranslation();

  return (
    <MultisigWalletHeaderAlertContainer>
      <MultisigWalletHeaderAlertTitle>
        <InfoRoundedIcon />
        <Typography fontWeight={700} marginLeft={1}>
          {t('multisig.alert.title')}
        </Typography>
      </MultisigWalletHeaderAlertTitle>
      <MultisigWalletHeaderAlertContent marginTop={1.5}>
        {t('multisig.alert.description')}
      </MultisigWalletHeaderAlertContent>
    </MultisigWalletHeaderAlertContainer>
  );
};

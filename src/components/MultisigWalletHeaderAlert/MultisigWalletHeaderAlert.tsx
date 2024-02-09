import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  MultisigWalletHeaderAlertContainer,
  MultisigWalletHeaderAlertContent,
  MultisigWalletHeaderAlertTitle,
} from '.';

export const MultisigWalletHeaderAlert = () => {
  const t = useTranslations();

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

import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  MultisigWalletHeaderAlertContainer,
  MultisigWalletHeaderAlertContent,
  MultisigWalletHeaderAlertTitle,
} from './MultisigWalletHeaderAlert.style';

export const MultisigWalletHeaderAlert = () => {
  const { t: translate } = useTranslation();

  return (
    <MultisigWalletHeaderAlertContainer>
      <MultisigWalletHeaderAlertTitle>
        <InfoRoundedIcon />
        <Typography fontWeight={700} marginLeft={1}>
          {translate('multisig.alert.multisig.alert.title', 'translation')}
        </Typography>
      </MultisigWalletHeaderAlertTitle>
      <MultisigWalletHeaderAlertContent marginTop={1.5}>
        {translate('multisig.alert.description', 'translation')}
      </MultisigWalletHeaderAlertContent>
    </MultisigWalletHeaderAlertContainer>
  );
};

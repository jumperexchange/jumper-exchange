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
  const I18_PATH = 'multisig.alert.';

  return (
    <MultisigWalletHeaderAlertContainer>
      <MultisigWalletHeaderAlertTitle>
        <InfoRoundedIcon />
        <Typography fontWeight={700} marginLeft={1}>
          {translate(`${I18_PATH}multisig.alert.title`, 'translation')}
        </Typography>
      </MultisigWalletHeaderAlertTitle>
      <MultisigWalletHeaderAlertContent marginTop={1.5}>
        {translate(`${I18_PATH}description`, 'translation')}
      </MultisigWalletHeaderAlertContent>
    </MultisigWalletHeaderAlertContainer>
  );
};

import { Alert, AlertTitle, useTheme } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

interface TestnetAlertProps {
  url: string;
}

export const TestnetAlert = ({ url }: TestnetAlertProps) => {
  const theme = useTheme();
  const { t: translate } = useTranslation();
  const i18Path = 'alert.';

  return (
    <Alert
      severity="info"
      sx={{
        margin: `${theme.spacing(4)} auto ${theme.spacing(2)}`,
        width: '75%',
        minWidth: 392,
        '& a': {
          fontSize: 'larger',
          marginLeft: '4px',
          transform: 'translateY("2px")',
        },
      }}
    >
      <AlertTitle>{translate(`${i18Path}info`)}</AlertTitle>
      <Trans
        i18nKey={`${i18Path}testnet`}
        values={{ url }}
        components={[<a href={url}>##placeholder-for-jumper-url##</a>]}
      />
    </Alert>
  );
};

import { Alert, AlertTitle, useTheme } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

export const TestnetAlert = ({}) => {
  const theme = useTheme();
  const { t: translate } = useTranslation();
  const i18Path = 'alert.';
  const prodUrl: string = 'https://jumper.exchange';

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
          color: theme.palette.mode === 'dark' && theme.palette.white.main,
        },
      }}
    >
      <AlertTitle>{translate(`${i18Path}info`)}</AlertTitle>
      <Trans
        i18nKey={`${i18Path}testnet`}
        values={{ url: prodUrl }}
        components={[<a href={prodUrl}>##placeholder-for-jumper-url##</a>]}
      />
    </Alert>
  );
};

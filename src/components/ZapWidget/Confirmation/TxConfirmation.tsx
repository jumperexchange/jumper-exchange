import { alpha, Box, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  FlexRowCenterGapBox,
  RoundedColoredBox,
  TxConfirmationMainBox,
} from './TxConfirmation.style';

export const TxConfirmation = ({
  s,
  link,
  success,
}: {
  s: string;
  link: string;
  success?: boolean;
}) => {
  const theme = useTheme();

  return (
    <TxConfirmationMainBox>
      <FlexRowCenterGapBox>
        <RoundedColoredBox>
          {success ? (
            <CheckIcon
              sx={{
                width: '16px',
                height: '16px',
                color: theme.palette.text.primary,
              }}
            />
          ) : (
            <InfoIcon
              sx={{
                width: '16px',
                height: '16px',
                color: theme.palette.text.primary,
              }}
            />
          )}
        </RoundedColoredBox>
        <Typography color={theme.palette.text.primary}>{s}</Typography>
      </FlexRowCenterGapBox>
      <a
        href={link}
        target="_blank"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
        }}
        rel="noreferrer"
      >
        <RoundedColoredBox>
          <OpenInNewIcon
            sx={{
              width: '16px',
              height: '16px',
              color: theme.palette.text.primary,
            }}
          />
        </RoundedColoredBox>
      </a>
    </TxConfirmationMainBox>
  );
};

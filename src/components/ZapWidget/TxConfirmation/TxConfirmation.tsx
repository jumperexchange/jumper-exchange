import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import { FC } from 'react';
import { BaseAlert } from 'src/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from 'src/components/Alerts/BaseAlert/BaseAlert.styles';
import { Link } from 'src/components/Link/Link';

interface TxConfirmationProps {
  description: string;
  link: string;
  success?: boolean;
}

export const TxConfirmation: FC<TxConfirmationProps> = ({
  description,
  link,
  success,
}: {
  description: string;
  link: string;
  success?: boolean;
}) => {
  return (
    <Box sx={(theme) => ({ paddingX: theme.spacing(3) })}>
      <BaseAlert
        description={description}
        headerPrepend={
          <Link
            href={link}
            target="_blank"
            rel="noreferrer"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <OpenInNewIcon
              sx={{
                margin: 0.5,
                width: '16px',
                height: '16px',
              }}
            />
          </Link>
        }
        variant={success ? BaseAlertVariant.Default : BaseAlertVariant.Info}
      />
    </Box>
  );
};

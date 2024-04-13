import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import WalletIcon from '@mui/icons-material/Wallet';
import { Box } from '@mui/material';
import {
  WidgetFooter,
  WidgetSkeletonContainer,
  WidgetSkeletonHeader,
  WidgetSkeletonIconButton,
  WidgetSkeletonMainButton,
  WidgetSkeletonMainButtonTypography,
  WidgetSkeleton as WidgetSkeletonStyles,
  WidgetSkeletonTitle,
  WidgetSkeletonWalletButton,
} from './WidgetView.style';

interface WidgetSkeletonProps {
  welcomeScreenClosed: boolean;
  title: string;
  buttonTitle: string;
}

export const WidgetSkeleton = ({
  welcomeScreenClosed,
  title,
  buttonTitle,
}: WidgetSkeletonProps) => {
  return (
    <WidgetSkeletonContainer welcomeScreenClosed={welcomeScreenClosed}>
      <WidgetSkeletonHeader>
        <WidgetSkeletonTitle>{title}</WidgetSkeletonTitle>
        <Box
          display="flex"
          gap="4px"
          sx={{
            'div:last-of-type': {
              marginRight: '-10px',
            },
          }}
        >
          <WidgetSkeletonIconButton>
            <ReceiptLongIcon />
          </WidgetSkeletonIconButton>
          <WidgetSkeletonIconButton>
            <SettingsIcon />
          </WidgetSkeletonIconButton>
        </Box>
      </WidgetSkeletonHeader>
      <WidgetSkeletonStyles variant="rounded" width={368} height={104} />
      <WidgetSkeletonStyles
        variant="rounded"
        width={368}
        height={104}
        sx={{ marginTop: '16px' }}
      />
      <WidgetSkeletonStyles
        variant="rounded"
        width={368}
        height={104}
        sx={{ marginTop: '16px' }}
      />
      <WidgetFooter>
        <WidgetSkeletonMainButton>
          <WidgetSkeletonMainButtonTypography>
            {buttonTitle}
          </WidgetSkeletonMainButtonTypography>
        </WidgetSkeletonMainButton>
        <WidgetSkeletonWalletButton>
          <WalletIcon />
        </WidgetSkeletonWalletButton>
      </WidgetFooter>
    </WidgetSkeletonContainer>
  );
};

import { FC, useEffect, useRef } from 'react';
import { ButtonPrimary } from 'src/components/Button/Button.style';
import {
  BottomSheet,
  BottomSheetBase,
} from 'src/components/core/BottomSheet/BottomSheet';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'src/components/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface TxBottomSheetProps {
  title: string;
  description: string;
  link: string;
  containerId: string;
  isOpen: boolean;
}

export const TxBottomSheet: FC<TxBottomSheetProps> = ({
  title,
  description,
  link,
  containerId,
  isOpen,
}) => {
  const bottomSheetRef = useRef<BottomSheetBase>(null);

  useEffect(() => {
    if (isOpen && !bottomSheetRef.current?.isOpen()) {
      bottomSheetRef.current?.open();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      bottomSheetRef.current?.close();
    };
  }, []);

  return (
    <BottomSheet containerId={containerId} ref={bottomSheetRef}>
      <Box
        sx={{
          padding: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="titleXSmall" sx={{ py: 1 }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            py: 1,
            mb: 2,
          }}
        >
          <Typography variant="bodyMedium" sx={{ fontWeight: 400 }}>
            {description}
          </Typography>
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
        </Box>

        <ButtonPrimary
          fullWidth
          onClick={() => bottomSheetRef.current?.close()}
          variant="contained"
          style={{ boxShadow: 'none' }}
        >
          Close
        </ButtonPrimary>
      </Box>
    </BottomSheet>
  );
};

import InfoIcon from '@mui/icons-material/Info';
import type { SxProps, Theme } from '@mui/material';
import { Box, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import {
  DigitCardBox,
  DigitCardHeader,
  DigitCardTokenContainer,
} from './style';

interface DigitCardProps {
  title: string;
  digit?: string | number | undefined;
  tooltipText?: string;
  tokenImage?: string;
  hasDeposited?: boolean;
  sx?: SxProps<Theme>;
}

// TODO: Duplicate of DigitCard
const DigitTextCard = ({
  title,
  digit,
  hasDeposited,
  tooltipText,
  tokenImage,
  sx,
}: DigitCardProps) => {
  const theme = useTheme();

  return (
    <DigitCardBox sx={sx}>
      <DigitCardHeader display={'flex'}>
        <Typography variant="subtitle2">{title}</Typography>
        <Tooltip
          title={tooltipText}
          placement={'top'}
          enterTouchDelay={0}
          arrow
        >
          <InfoIcon
            sx={{
              width: '16px',
              height: '16px',
              marginLeft: '4px',
              color: 'inherit',
              cursor: 'help',
            }}
          />
        </Tooltip>
      </DigitCardHeader>
      <Box
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <DigitCardTokenContainer
          sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          key={`market-card-token-container-name-${title}`}
        >
          {tokenImage ? (
            <img
              key={`market-card-token-${tokenImage}`}
              src={tokenImage}
              alt={`${digit} logo`}
              width={24}
              height={24}
              style={{ borderRadius: '50%' }}
            />
          ) : (
            <Skeleton
              key={`market-card-token-skeleton`}
              variant="circular"
              sx={{ width: 24, height: 24 }}
            />
          )}
          <Typography
            variant="h6"
            className="content"
            key={`market-card-token-label`}
            sx={[
              {
                fontWeight: 700,
                marginTop: '4px',
              },
              hasDeposited
                ? {
                    color: theme.palette.primary.main,
                  }
                : {
                    color: null,
                  },
            ]}
          >
            {digit}
          </Typography>
        </DigitCardTokenContainer>
      </Box>
    </DigitCardBox>
  );
};

export default DigitTextCard;

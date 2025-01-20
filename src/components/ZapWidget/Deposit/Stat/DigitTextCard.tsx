import type { SxProps, Theme } from '@mui/material';
import { Box, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from 'src/components/Berachain/components/BerachainMarketCard/StatCard/BerachainProgressCard.style';
import { BerachainMarketCardTokenContainer } from 'src/components/Berachain/components/BerachainMarketCard/BerachainMarketCard.style';

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
    <BeraChainProgressCardContent sx={sx}>
      <BeraChainProgressCardHeader display={'flex'}>
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
      </BeraChainProgressCardHeader>
      <Box
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <BerachainMarketCardTokenContainer
          sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          key={`berachain-market-card-token-container-name-${title}`}
        >
          {tokenImage ? (
            <img
              key={`berachain-market-card-token-${tokenImage}`}
              src={tokenImage}
              alt={`${digit} logo`}
              width={24}
              height={24}
              style={{ borderRadius: '50%' }}
            />
          ) : (
            <Skeleton
              key={`berachain-market-card-token-skeleton`}
              variant="circular"
              sx={{ width: 24, height: 24 }}
            />
          )}
          <Typography
            variant="h6"
            className="content"
            key={`berachain-market-card-token-label`}
            sx={{
              color: hasDeposited ? theme.palette.primary.main : undefined,
              fontWeight: 700,
              marginTop: '4px',
            }}
          >
            {digit}
          </Typography>
        </BerachainMarketCardTokenContainer>
      </Box>
    </BeraChainProgressCardContent>
  );
};

export default DigitTextCard;

import { Box, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from './BerachainProgressCard.style';
import { BerachainMarketCardTokenContainer } from '../BerachainMarketCard.style';

interface DigitCardProps {
  title: string;
  digit?: string | number | undefined;
  tooltipText?: string;
  tokenImage?: string;
  hasDeposited?: boolean;
}

const DigitTokenSymbolCard = ({
  title,
  digit,
  hasDeposited,
  tooltipText,
  tokenImage,
}: DigitCardProps) => {
  const theme = useTheme();

  return (
    <BeraChainProgressCardContent>
      <BeraChainProgressCardHeader display={'flex'}>
        <Typography
          variant="bodySmall"
          sx={(theme) => ({
            typography: {
              xs: theme.typography.bodyXSmall,
              sm: theme.typography.bodySmall,
            },
          })}
        >
          {title}
        </Typography>
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
              style={{ borderRadius: '10px' }}
            />
          ) : (
            <Skeleton
              key={`berachain-market-card-token-skeleton`}
              variant="circular"
              sx={{ width: 24, height: 24 }}
            />
          )}
          <Typography
            variant="titleXSmall"
            marginTop={'4px'}
            sx={(theme) => ({
              typography: {
                xs: theme.typography.titleXSmall,
                sm: theme.typography.titleXSmall,
              },
            })}
            key={`berachain-market-card-token-label`}
            color={hasDeposited ? theme.palette.primary.main : undefined}
          >
            {digit}
          </Typography>
        </BerachainMarketCardTokenContainer>
      </Box>
    </BeraChainProgressCardContent>
  );
};

export default DigitTokenSymbolCard;

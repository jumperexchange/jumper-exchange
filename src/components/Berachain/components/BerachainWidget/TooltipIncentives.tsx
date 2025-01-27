import type { EnrichedMarketDataType } from 'royco/queries';
import { Avatar, Box, List, ListItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { divideBy, titleSlicer } from '@/components/Berachain/utils';

function TooltipIncentives({ market }: { market: EnrichedMarketDataType }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Per 1
        </Typography>
        <img
          key={`berachain-market-card-token-${market?.input_token_data?.name}-${market?.input_token_data?.id}`}
          src={market?.input_token_data?.image}
          alt={`${market?.input_token_data?.name}-logo`}
          width={16}
          height={16}
          style={{
            borderRadius: '10px',
            marginLeft: '6px',
            marginRight: '2px',
          }}
        />
        <Typography variant="body2" color="textSecondary">
          {` ${titleSlicer(market?.input_token_data.symbol)}, you receive:`}
        </Typography>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={'8px'}
        marginTop={'8px'}
      >
        {market?.incentive_tokens_data?.map((incentiveTokenData) => (
          <Box
            key={incentiveTokenData.id}
            display={'flex'}
            flexDirection={'row'}
            marginLeft={'4px'}
            gap={'4px'}
          >
            {/*The below /100 is a test about the token value because it seems that the decimals are included, make sure it works correctly or remove it */}
            {t('format.decimal', {
              value: divideBy(incentiveTokenData.token_amount),
            })}{' '}
            {incentiveTokenData.symbol}{' '}
            <img
              key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
              src={incentiveTokenData?.image}
              alt={`${incentiveTokenData?.name}-logo`}
              width={16}
              height={16}
              style={{
                borderRadius: '10px',
                marginLeft: '4px',
              }}
            />
          </Box>
        ))}
        {market?.external_incentives?.map((incentiveTokenData) => (
          <Box
            key={incentiveTokenData.id}
            display={'flex'}
            flexDirection={'row'}
            marginLeft={'4px'}
            gap={'4px'}
          >
            {incentiveTokenData.label}
            {' - '}
            {incentiveTokenData.value}
            <img
              key={`berachain-market-card-token-${incentiveTokenData?.name}-${incentiveTokenData?.id}`}
              src={incentiveTokenData?.image}
              alt={`${incentiveTokenData?.name}-logo`}
              width={16}
              height={16}
              style={{
                borderRadius: '10px',
                marginLeft: '4px',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default TooltipIncentives;

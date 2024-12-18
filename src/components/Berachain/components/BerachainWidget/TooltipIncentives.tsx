import type { EnrichedMarketDataType } from 'royco/queries';
import { Avatar, Box, List, ListItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function TooltipIncentives({ market }: { market: EnrichedMarketDataType }) {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="body2" color="textSecondary">
        Per input token, you receive:
      </Typography>
      <List>
        {market.incentive_tokens_data.map((incentiveTokenData) => (
          <ListItem
            secondaryAction={
              <Avatar
                sx={{ marginLeft: 0.5, width: '24px', height: '24px' }}
                src={incentiveTokenData.image}
                alt={incentiveTokenData.name}
              />
            }
            key={incentiveTokenData.id}
          >
            {t('format.decimal', { value: incentiveTokenData.per_input_token })}{' '}
            {incentiveTokenData.symbol}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default TooltipIncentives;

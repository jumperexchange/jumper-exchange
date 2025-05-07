import InfoIcon from '@mui/icons-material/Info';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CampaignEndedInfoBox } from './CampaignEndedInfo.style';

interface CampaignEndedInfoProps {
  endDate: string;
}

export const CampaignEndedInfo = ({ endDate }: CampaignEndedInfoProps) => {
  const { t } = useTranslation();
  const formattedDate = t('format.shortDate', {
    value: new Date(endDate),
  });

  return (
    <CampaignEndedInfoBox>
      <InfoIcon sx={{ width: '32px', height: '32px' }} />
      <Typography variant="bodyMediumStrong">
        {t('campaign.ended', { date: formattedDate })}
      </Typography>
    </CampaignEndedInfoBox>
  );
};

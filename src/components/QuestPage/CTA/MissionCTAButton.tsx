import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButtonPrimary } from 'src/components/IconButton';

interface MissionCTAButtonProps {
  activeCampaign?: string;
  onClick: () => void;
}

export const MissionCTAButton = ({
  activeCampaign,
  onClick,
}: MissionCTAButtonProps) => {
  return (
    <IconButtonPrimary onClick={onClick}>
      <ArrowForwardIcon
        sx={(theme) => ({
          width: '28px',
          height: '28px',
          color: (theme) => (theme.vars || theme).palette.white.main,
        })}
      />
    </IconButtonPrimary>
  );
};

import Typography from '@mui/material/Typography';
import { HeaderContainer } from '../JumperWidget.style';
import Box from '@mui/material/Box';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';

interface MainHeaderProps {
  header: string;
  onSettingsClick?: () => void;
}

export const MainHeader = ({ header, onSettingsClick }: MainHeaderProps) => (
  <HeaderContainer
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="titleSmall">{header}</Typography>
    {onSettingsClick && (
      <IconButton
        variant={Variant.Borderless}
        size={Size.XL}
        onClick={onSettingsClick}
        aria-label="Settings"
      >
        <SettingsIcon />
      </IconButton>
    )}
  </HeaderContainer>
);

export const GoBackHeader = ({
  header,
  onBack,
}: {
  header: string;
  onBack: () => void;
}) => (
  <HeaderContainer>
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconButton
        variant={Variant.Borderless}
        size={Size.XL}
        onClick={onBack}
        aria-label="Go back"
        sx={{ position: 'absolute', left: 0 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="titleXSmall" sx={{ textAlign: 'center' }}>
        {header}
      </Typography>
    </Box>
  </HeaderContainer>
);

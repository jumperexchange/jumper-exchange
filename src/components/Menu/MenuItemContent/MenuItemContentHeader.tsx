import { JumperLogo } from '@/components/illustrations/JumperLogo';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import { IconButtonTransparent } from '@/components/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface MenuItemContentHeaderProps {
  onClose: () => void;
}

export const MenuItemContentHeader = ({
  onClose,
}: MenuItemContentHeaderProps) => {
  return (
    <>
      <LogoWrapper sx={{ '& svg.jumper-logo': { height: '28px !important' } }}>
        <JumperLogo />
      </LogoWrapper>
      <IconButtonTransparent onClick={onClose}>
        <CloseIcon />
      </IconButtonTransparent>
    </>
  );
};

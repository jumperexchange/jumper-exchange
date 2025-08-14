import { FC } from 'react';
import {
  NavbarButton,
  NavbarButtonContentContainer,
  NavbarButtonLabel,
} from './Buttons.style';
import { Link } from 'src/components/Link';
import Skeleton from '@mui/material/Skeleton';

interface LabelButtonProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  isLabelVisible?: boolean;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  isLoading?: boolean;
  id?: string;
}

export const LabelButton: FC<LabelButtonProps> = ({
  icon,
  label,
  isLabelVisible = true,
  href,
  isActive,
  isLoading,
  id,
  onClick,
}) => {
  const button = (
    <NavbarButton isActive={isActive} id={id} onClick={onClick}>
      <NavbarButtonContentContainer>
        {icon}
        {isLoading ? (
          <Skeleton variant="rounded" sx={{ width: 80, height: 24 }} />
        ) : (
          isLabelVisible && (
            <NavbarButtonLabel variant={'bodyMediumStrong'}>
              {label}
            </NavbarButtonLabel>
          )
        )}
      </NavbarButtonContentContainer>
    </NavbarButton>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        {button}
      </Link>
    );
  }

  return button;
};

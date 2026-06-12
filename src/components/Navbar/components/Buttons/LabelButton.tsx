import type { FC } from 'react';
import Typography from '@mui/material/Typography';
import {
  NavbarButton,
  NavbarButtonContentContainer,
  NavbarButtonLabel,
  NavbarButtonLabelColumn,
} from './Buttons.style';
import { Link } from 'src/components/Link/Link';
import Skeleton from '@mui/material/Skeleton';

interface LabelButtonProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  // Second, smaller line below the label.
  caption?: React.ReactNode;
  isLabelVisible?: boolean;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  isLoading?: boolean;
  id?: string;
  'data-testid'?: string;
}

export const LabelButton: FC<LabelButtonProps> = ({
  icon,
  label,
  caption,
  isLabelVisible = true,
  href,
  isActive,
  isLoading,
  id,
  onClick,
  'data-testid': dataTestId,
}) => {
  const labelContent = caption ? (
    <NavbarButtonLabelColumn>
      <Typography
        variant="bodySmallStrong"
        noWrap
        sx={(theme) => ({
          color: (theme.vars || theme).palette.alpha600.main,
        })}
      >
        {label}
      </Typography>
      <Typography variant="bodyXXSmall" color="textSecondary" noWrap>
        {caption}
      </Typography>
    </NavbarButtonLabelColumn>
  ) : (
    <NavbarButtonLabel variant={'bodyMediumStrong'}>{label}</NavbarButtonLabel>
  );

  const button = (
    <NavbarButton
      isActive={isActive}
      id={id}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <NavbarButtonContentContainer>
        {icon}
        {isLoading ? (
          <Skeleton variant="rounded" sx={{ width: 80, height: 24 }} />
        ) : (
          isLabelVisible && labelContent
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

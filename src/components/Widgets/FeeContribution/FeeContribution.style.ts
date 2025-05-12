import { alpha, Button, ButtonProps, darken, styled } from '@mui/material';

interface ContributionButtonProps extends ButtonProps {
  active: boolean;
}

export const ContributionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<ContributionButtonProps>(({ theme, active }) => ({
  width: '100%',
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 700,
  height: '32px',
  color: alpha(theme.palette.text.primary, 0.84),
  transition: 'background-color 250ms',
  backgroundColor: active ? '#F0E5FF' : theme.palette.grey[100],
  '&:hover': {
    backgroundColor: active ? darken('#F0E5FF', 0.04) : theme.palette.grey[300],
  },
}));

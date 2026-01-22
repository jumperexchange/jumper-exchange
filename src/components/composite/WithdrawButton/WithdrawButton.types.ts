import type { ButtonProps } from '@mui/material/Button';

export interface WithdrawButtonProps extends ButtonProps {
  onClick: () => void;
  label?: string;
  tooltip?: React.ReactNode;
}

import type { ButtonProps } from '@mui/material/Button';

export enum DepositButtonDisplayMode {
  IconOnly = 'icon-only',
  LabelOnly = 'label-only',
  IconAndLabel = 'icon-and-label',
}

export interface DepositButtonProps extends ButtonProps {
  onClick: () => void;
  displayMode?: DepositButtonDisplayMode;
  label?: string;
}

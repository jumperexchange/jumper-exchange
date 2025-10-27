import { ChangeEventHandler, FC, FocusEventHandler } from 'react';
import { TaskInputField } from './TaskInput.styles';
import { SxProps, Theme } from '@mui/material/styles';

export interface TaskInputProps {
  id: string;
  name: string;
  label?: string;
  value?: string;
  placeholder: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  sx?: SxProps<Theme>;
}

export const TaskInput: FC<TaskInputProps> = ({
  id,
  name,
  value,
  placeholder,
  disabled,
  onChange,
  onFocus,
  onBlur,
  sx,
}) => {
  return (
    <TaskInputField
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      type="text"
      autoComplete="off"
      disabled={disabled}
      fullWidth
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      sx={sx}
    />
  );
};

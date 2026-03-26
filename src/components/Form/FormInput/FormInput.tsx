import type { ChangeEventHandler, FC, FocusEventHandler } from 'react';
import { FormInputErrorMessage, FormInputField } from './FormInput.styles';
import type { SxProps, Theme } from '@mui/material/styles';

export interface FormInputProps {
  id: string;
  name: string;
  label?: string;
  value?: string;
  placeholder: string;
  disabled?: boolean;
  errorMessage?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  sx?: SxProps<Theme>;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const FormInput: FC<FormInputProps> = ({
  id,
  name,
  value,
  placeholder,
  disabled,
  errorMessage,
  onChange,
  onFocus,
  onBlur,
  sx,
  startAdornment,
  endAdornment,
}) => {
  return (
    <>
      <FormInputField
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
        disabled={disabled}
        error={!!errorMessage}
        fullWidth
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        sx={sx}
      />
      {errorMessage && (
        <FormInputErrorMessage variant="bodyMedium">
          {errorMessage}
        </FormInputErrorMessage>
      )}
    </>
  );
};

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Returns TextField-compatible props for a password field with a show/hide toggle.
 * Spread the returned object directly onto a MUI TextField:
 *   <TextField {...passwordField} ... />
 */
export function usePasswordField() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    type: (showPassword ? 'text' : 'password') as 'text' | 'password',
    slotProps: {
      input: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={toggleShowPassword}
              edge="end"
              aria-label={
                showPassword
                  ? t('jumperWallet.login.hidePassword')
                  : t('jumperWallet.login.showPassword')
              }
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      },
    },
  };
}

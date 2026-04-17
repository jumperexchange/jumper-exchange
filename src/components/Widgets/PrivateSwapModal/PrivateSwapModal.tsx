'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

import { FormInput } from 'src/components/Form/FormInput/FormInput';
import { ModalContainer } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { isValidAddress } from 'src/utils/regex-patterns';

import { PrivateSwapModalCard } from './PrivateSwapModal.styles';
import { Variant } from '@/components/core/buttons/types';
import { Button } from '@/components/core/buttons/Button/Button';

export interface PrivateSwapModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (address: string) => void;
  initialAddress?: string;
}

export const PrivateSwapModal: FC<PrivateSwapModalProps> = ({
  open,
  onClose,
  onConfirm,
  initialAddress = '',
}) => {
  const { t } = useTranslation();
  const [address, setAddress] = useState(initialAddress);
  const [box1, setBox1] = useState(false);
  const [box2, setBox2] = useState(false);

  useEffect(() => {
    if (open && initialAddress !== undefined) {
      setAddress(initialAddress);
    }
  }, [open, initialAddress]);

  const canConfirm = isValidAddress(address) && box1 && box2;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
    } catch {
      // clipboard access denied — no-op
    }
  };

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(address);
    }
  };

  return (
    <ModalContainer isOpen={open} onClose={onClose}>
      <PrivateSwapModalCard>
        <Typography
          variant="titleSmall"
          sx={{
            fontWeight: 700,
          }}
        >
          {t('modal.privateSwap.title')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="bodyMedium">
            {t('modal.privateSwap.subtitle')}
          </Typography>
        </Box>

        <FormInput
          id="private-swap-address"
          name="private-swap-address"
          value={address}
          placeholder={t('modal.privateSwap.addressPlaceholder')}
          onChange={(e) => setAddress(e.target.value)}
          startAdornment={
            <Button variant={Variant.Secondary} onClick={handlePaste}>
              {t('modal.privateSwap.paste')}
            </Button>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={box1}
              onChange={(e) => setBox1(e.target.checked)}
            />
          }
          label={
            <Typography variant="bodySmall">
              {t('modal.privateSwap.disclaimer1')}
            </Typography>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={box2}
              onChange={(e) => setBox2(e.target.checked)}
            />
          }
          label={
            <Typography variant="bodySmall">
              {t('modal.privateSwap.disclaimer2')}
            </Typography>
          }
        />

        <Button
          variant={Variant.Primary}
          fullWidth
          disabled={!canConfirm}
          onClick={handleConfirm}
        >
          {t('modal.privateSwap.confirm')}
        </Button>
      </PrivateSwapModalCard>
    </ModalContainer>
  );
};

import Typography from '@mui/material/Typography';
import { FC } from 'react';
import {
  StyledModalContentContainer,
  StyledTitleContainer,
} from '../../ClaimPerkModal.styles';
import { ErrorIconCircle } from '../../ClaimPerkModal.styles';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import { Button } from 'src/components/Button/Button';
import { useTranslation } from 'react-i18next';

interface WalletStepContentProps {}

export const SignatureRequiredContent: FC<WalletStepContentProps> = ({}) => {
  const { t } = useTranslation();
  return (
    <StyledModalContentContainer>
      <ErrorIconCircle>
        <ErrorRounded />
      </ErrorIconCircle>

      <StyledTitleContainer>
        <Typography variant="titleXSmall">
          {t('modal.perks.signatureFailed.title')}
        </Typography>
      </StyledTitleContainer>

      <Typography variant="bodyMedium" color="textSecondary">
        {t('modal.perks.signatureFailed.description')}
      </Typography>

      <Button fullWidth variant="primary" type="submit">
        {t('modal.perks.signatureFailed.tryAgain')}
      </Button>
    </StyledModalContentContainer>
  );
};

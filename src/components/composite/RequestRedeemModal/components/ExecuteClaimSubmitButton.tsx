import { Button } from '@/components/core/buttons/Button/Button';
import { useWidgetSubmit } from '../../JumperWidget/store';
import { Size, Variant } from '@/components/core/buttons/types';
import { useTranslation } from 'react-i18next';
import type { FC } from 'react';

interface ExecuteClaimSubmitButtonProps {
  isFormSubmitting: boolean;
}

export const ExecuteClaimSubmitButton: FC<ExecuteClaimSubmitButtonProps> = ({
  isFormSubmitting,
}) => {
  const { t } = useTranslation();
  const { isSubmitting } = useWidgetSubmit();

  return (
    <Button
      type="submit"
      variant={Variant.Primary}
      size={Size.LG}
      fullWidth
      loading={isSubmitting || isFormSubmitting}
      disabled={isSubmitting || isFormSubmitting}
    >
      {t('buttons.withdraw')}
    </Button>
  );
};

import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { useTranslation } from 'react-i18next';
import {
  useFormValidation,
  useWidgetSubmit,
} from '@/components/composite/JumperWidget/store';

export const ConvertDustSubmitButton = ({
  isFormSubmitting,
}: {
  isFormSubmitting: boolean;
}) => {
  const { t } = useTranslation();
  const { isValid, isTouched } = useFormValidation();
  const { isSubmitting } = useWidgetSubmit();

  const isDisabled =
    isFormSubmitting || isSubmitting || (!isValid && isTouched);
  return (
    <Button variant={Variant.Primary} disabled={isDisabled} type="submit">
      {t('buttons.reviewConversion')}
    </Button>
  );
};

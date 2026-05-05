import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { useTranslation } from 'react-i18next';
import { useWidgetSubmit } from '@/components/composite/JumperWidget/store';

export const RouteOverviewSubmitButton = ({
  isFormSubmitting,
}: {
  isFormSubmitting: boolean;
}) => {
  const { t } = useTranslation();
  const { isSubmitting } = useWidgetSubmit();
  const isLoading = isFormSubmitting || isSubmitting;
  return (
    <Button
      variant={Variant.Primary}
      disabled={isLoading}
      loading={isLoading}
      type="submit"
    >
      {t('buttons.convertDust')}
    </Button>
  );
};

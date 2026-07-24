import { useTranslation } from 'react-i18next';
import { TabSelect } from '@/components/core/TabSelect/TabSelect';
import { ApyWindowOptions, type ApyWindow } from '@/utils/earn/apyWindow';

type Props = {
  value: ApyWindow;
  onChange: (value: ApyWindow) => void;
  disabled?: boolean;
};

export const EarnApyWindowToggle: React.FC<Props> = ({
  value,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <TabSelect
      options={[
        {
          value: ApyWindowOptions.SEVEN_DAY,
          label: t('earn.apyWindow.label7d'),
          tooltip: t('earn.apyWindow.toggleTooltip7d'),
        },
        {
          value: ApyWindowOptions.THIRTY_DAY,
          label: t('earn.apyWindow.label30d'),
          tooltip: t('earn.apyWindow.toggleTooltip30d'),
        },
      ]}
      value={value}
      onChange={(v) => onChange(v as ApyWindow)}
      size="small"
      disabled={disabled}
      data-testid="earn-filter-apy-window-select"
    />
  );
};

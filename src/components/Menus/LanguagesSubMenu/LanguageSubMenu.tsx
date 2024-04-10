import { SubMenu } from '@/components/Menu/SubMenu';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import { useTranslation } from 'react-i18next';
import { useLanguagesContent } from '.';

export const LanguagesSubmenu = () => {
  const { t } = useTranslation();
  const subMenuLanguages = useLanguagesContent();
  const openSubMenu = useMenuStore((state) => state.openSubMenu);

  return (
    <SubMenu
      label={t('language.key', { ns: 'language' })}
      triggerSubMenu={MenuKeysEnum.Language}
      open={openSubMenu === MenuKeysEnum.Language}
      prevMenu={MenuKeysEnum.None}
      subMenuList={subMenuLanguages}
    />
  );
};

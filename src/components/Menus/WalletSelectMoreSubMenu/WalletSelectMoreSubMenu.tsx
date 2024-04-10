import { SubMenu } from '@/components/Menu/SubMenu';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import { useTranslation } from 'react-i18next';
import { useWalletSelectContent } from '..';

export const WalletSelectMoreSubMenu = () => {
  const { t } = useTranslation();
  const walletSelectMenuItems = useWalletSelectContent();
  const openSubMenu = useMenuStore((state) => state.openSubMenu);

  return (
    <SubMenu
      label={t('navbar.walletSelectMenu.wallets')}
      triggerSubMenu={MenuKeysEnum.WalletSelectMore}
      open={openSubMenu === MenuKeysEnum.WalletSelectMore}
      prevMenu={MenuKeysEnum.None}
      subMenuList={walletSelectMenuItems}
    />
  );
};

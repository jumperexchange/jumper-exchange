import { useTranslation } from 'react-i18next';
import { SubMenu } from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';
import { useWalletSelectContent } from '..';

export const WalletSelectMoreSubMenu = () => {
  const { t } = useTranslation();
  const walletSelectMenuItems = useWalletSelectContent();
  const openSubMenu = useMenuStore((state) => state.openSubMenu);

  return (
    <SubMenu
      label={t('navbar.walletSelectMenu.wallets')}
      triggerSubMenu={MenuKeys.WalletSelectMore}
      open={openSubMenu === MenuKeys.WalletSelectMore}
      prevMenu={MenuKeys.None}
      subMenuList={walletSelectMenuItems}
    />
  );
};

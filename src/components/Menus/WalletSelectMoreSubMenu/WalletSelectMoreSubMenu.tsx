import { useTranslations } from 'next-intl';
import { SubMenu } from 'src/components';
import { MenuKeysEnum } from 'src/const';
import { useMenuStore } from 'src/stores';
import { useWalletSelectContent } from '..';

export const WalletSelectMoreSubMenu = () => {
  const t = useTranslations();
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

import { useClientTranslation } from '@/i18n/useClientTranslation';
import { SubMenu } from 'src/components/Menu/SubMenu';
import { MenuKeysEnum } from 'src/const';
import { useMenuStore } from 'src/stores';
import { useWalletSelectContent } from '..';

export const WalletSelectMoreSubMenu = () => {
  const { t } = useClientTranslation();
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

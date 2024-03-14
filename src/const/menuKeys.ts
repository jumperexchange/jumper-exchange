export enum MenuKeys {
  Main = 'Main',
  WalletSelect = 'WalletSelect',
  WalletSelectMore = 'WalletSelectMore',
  Wallet = 'Wallet',
  Chains = 'Chains',
  Devs = 'Devs',
  Language = 'Language',
  EcosystemSelect = 'EcosystemSelect',
  None = 'None',
}

type MenuMainKeys =
  | MenuKeys.Main
  | MenuKeys.Chains
  | MenuKeys.Wallet
  | MenuKeys.WalletSelect
  | MenuKeys.EcosystemSelect;
type MenuSubKeys = Exclude<MenuKeys, MenuMainKeys>;

type MenuMainType = {
  [key in MenuMainKeys]: MenuKeys;
};

type MenuSubType = {
  [key in MenuSubKeys]: MenuKeys;
};

export const MenuMain: MenuMainType = {
  [MenuKeys.Main]: MenuKeys.Main,
  [MenuKeys.Chains]: MenuKeys.Chains,
  [MenuKeys.Wallet]: MenuKeys.Wallet,
  [MenuKeys.EcosystemSelect]: MenuKeys.EcosystemSelect,
  [MenuKeys.WalletSelect]: MenuKeys.WalletSelect,
};

export const MenuSub: MenuSubType = {
  [MenuKeys.Devs]: MenuKeys.Devs,
  [MenuKeys.Language]: MenuKeys.Language,
  [MenuKeys.WalletSelectMore]: MenuKeys.WalletSelectMore,
  [MenuKeys.None]: MenuKeys.None,
};

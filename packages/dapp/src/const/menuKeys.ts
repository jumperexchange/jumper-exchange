export enum MenuKeys {
  Main = 'Main',
  WalletSelect = 'WalletSelect',
  Wallet = 'Wallet',
  Showcases = 'Showcases',
  Themes = 'Themes',
  Chains = 'Chains',
  Devs = 'Devs',
  Language = 'Language',
  None = 'None',
}

type MenuMainKeys =
  | MenuKeys.Main
  | MenuKeys.Chains
  | MenuKeys.Wallet
  | MenuKeys.WalletSelect;
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
  [MenuKeys.WalletSelect]: MenuKeys.WalletSelect,
};

export const MenuSub: MenuSubType = {
  [MenuKeys.Themes]: MenuKeys.Themes,
  [MenuKeys.Devs]: MenuKeys.Devs,
  [MenuKeys.Language]: MenuKeys.Language,
  [MenuKeys.None]: MenuKeys.None,
  [MenuKeys.Showcases]: MenuKeys.Showcases,
};

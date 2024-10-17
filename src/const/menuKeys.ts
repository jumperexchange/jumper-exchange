export const MenuKeys = {
  Main: 'Main',
  Theme: 'Theme',
  Wallet: 'Wallet',
  Chains: 'Chains',
  Devs: 'Devs',
  Language: 'Language',
  None: 'None',
};

export enum MenuKeysEnum {
  Main = 'Main',
  Theme = 'Theme',
  Wallet = 'Wallet',
  Chains = 'Chains',
  Devs = 'Devs',
  Language = 'Language',
  None = 'None',
}

type MenuMainKeys =
  | MenuKeysEnum.Main
  | MenuKeysEnum.Chains
  | MenuKeysEnum.Wallet;
type MenuSubKeys = Exclude<MenuKeysEnum, MenuMainKeys>;

type MenuMainType = {
  [key in MenuMainKeys]: MenuKeysEnum;
};

type MenuSubType = {
  [key in MenuSubKeys]: MenuKeysEnum;
};

export const MenuMain: MenuMainType = {
  [MenuKeysEnum.Main]: MenuKeysEnum.Main,
  [MenuKeysEnum.Chains]: MenuKeysEnum.Chains,
  [MenuKeysEnum.Wallet]: MenuKeysEnum.Wallet,
};

export const MenuSub: MenuSubType = {
  [MenuKeysEnum.Devs]: MenuKeysEnum.Devs,
  [MenuKeysEnum.Theme]: MenuKeysEnum.Theme,
  [MenuKeysEnum.Language]: MenuKeysEnum.Language,
  [MenuKeysEnum.None]: MenuKeysEnum.None,
};

import { WalletState } from './types';

export enum HACKED_WALLET_STEPS {
  INTRO = 'intro',
  SOURCE_CONNECT = 'source_connect',
  SOURCE_SIGN = 'source_sign',
  DESTINATION_CONNECT = 'destination_connect',
  DESTINATION_SIGN = 'destination_sign',
  SUMMARY = 'summary',
  SUCCESS = 'success',
}

export const HACKED_WALLET_DEFAULT_STATE: WalletState = {
  account: undefined,
  verified: false,
  signed: false,
  signature: undefined,
  message: undefined,
};

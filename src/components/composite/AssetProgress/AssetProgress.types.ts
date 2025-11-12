import { Protocol, Token } from 'src/types/jumper-backend';

export enum AssetProgressVariant {
  Token = 'token',
  Protocol = 'protocol',
  Text = 'text',
}

export interface BaseAssetProgressProps {
  progress: number;
  amount: number;
}

export interface TokenAssetProgressProps extends BaseAssetProgressProps {
  variant: AssetProgressVariant.Token;
  token: Partial<Token> & Pick<Token, 'address' | 'chain'>;
}

export interface ProtocolAssetProgressProps extends BaseAssetProgressProps {
  variant: AssetProgressVariant.Protocol;
  protocol: Protocol;
}

export interface TextAssetProgressProps extends BaseAssetProgressProps {
  variant: AssetProgressVariant.Text;
  text: string;
}

export type AssetProgressProps =
  | TokenAssetProgressProps
  | ProtocolAssetProgressProps
  | TextAssetProgressProps;

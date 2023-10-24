type UTM_Medium_Types = 'feature_card' | 'landing_page' | 'menu' | 'testnet';

type UTM_Campaign_Types =
  | 'jumper_to_lifi'
  | 'jumper_to_docs'
  | 'jumper_to_explorer'
  | 'testnet_to_jumper';

export interface UtmParams {
  utm_medium?: UTM_Medium_Types;
  utm_campaign?: UTM_Campaign_Types;
  utm_term?: string;
  utm_content?: string;
}

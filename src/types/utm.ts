type UtmMedium = 'feature_card' | 'welcome_screen' | 'menu' | 'powered_by';

type UtmCampaign = 'jumper_to_explorer';

export interface UtmParams {
  utm_medium?: UtmMedium;
  utm_campaign?: UtmCampaign;
  utm_term?: string;
  utm_content?: string;
}

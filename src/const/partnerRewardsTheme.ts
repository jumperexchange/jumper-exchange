export const PROFILE_CAMPAIGN_DARK_COLOR = '#FFFFFF'; //#ECEEF0';
export const PROFILE_CAMPAIGN_LIGHT_COLOR = '#31007a'; //#9E1E1A';
export const PROFILE_CAMPAIGN_FLASHY_APY_COLOR = '#653ba3'; //#9E1E1A';

export const PROFILE_CAMPAIGN_DARK_TOKEN = `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Sei_Symbol_Gradient_ea276889b3.png`;
export const PROFILE_CAMPAIGN_LIGHT_TOKEN = `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Sei_Symbol_Gradient_ea276889b3.png`;

export const PROFILE_CAMPAIGN_DARK_CHAIN = `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Sei_Symbol_Gradient_ea276889b3.png`;
export const PROFILE_CAMPAIGN_LIGHT_CHAIN = `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Sei_Symbol_Gradient_ea276889b3.png`;

export const REWARDS_LIST = [
  {
    chainId: '1329',
    tokenChainId: 1329,
    claimingAddress: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
    tokenAddress: '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7',
    decimalsToShow: 1,
    explorerLink: 'https://seitrace.com',
    lightTokenLogo: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Sei_Symbol_Gradient_ea276889b3.png`,
    darkTokenLogo: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Sei_Symbol_Gradient_ea276889b3.png`,
    lightChainLogo: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Sei_Symbol_Gradient_ea276889b3.png`,
    darkChainLogo: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Sei_Symbol_Gradient_ea276889b3.png`,
  },
  {
    chainId: '30',
    tokenChainId: 30,
    claimingAddress: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
    tokenAddress: '0x542fda317318ebf1d3deaf76e0b632741a7e677d',
    decimalsToShow: 5,
    explorerLink: 'https://explorer.rootstock.io',
    lightTokenLogo: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/thumbnail_rbtc_logo_e8454e105a.png`,
    darkTokenLogo: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/thumbnail_rbtc_logo_e8454e105a.png`,
    lightChainLogo: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Layer_1_2_e342a1f262.svg`,
    darkChainLogo: `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Layer_1_2_e342a1f262.svg`,
  },
];

export const REWARDS_CHAIN_IDS = ['1135', '30', '8453'];
export const MERKL_CREATOR_TAG = 'sei-jumper';

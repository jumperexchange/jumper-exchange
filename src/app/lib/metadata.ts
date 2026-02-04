import type { Metadata } from 'next';

export const siteName = 'Jumper.Exchange';

export const pageMetadataFields = {
  default: {
    title: 'Jumper Exchange | Smart App for the Universal Market',
    description:
      'Move, deploy and manage your capital with Jumper. Fast swaps, capital deployment, and portfolio management in one smart app.',
  },
  earn: {
    title: 'Jumper Earn | Earn Smarter Across Chains',
    description:
      'Earn smarter across chains with Jumper Earn. Access DeFi earn opportunities, seamless swaps, and a consolidated portfolio view in one smart app.',
  },
  earnOpportunity: {
    title: 'Jumper Earn | {{opportunityName}}',
    description:
      'Earn smarter across chains with Jumper Earn. Access DeFi earn opportunities, seamless swaps, and a consolidated portfolio view in one smart app.',
  },
  portfolio: {
    title: 'Jumper Portfolio | Smarter Portfolio Overview',
    description:
      'Smarter cross-chain portfolio aggregation with Jumper Portfolio. Track assets in one smart app.',
  },
  profile: {
    title: 'Jumper Loyalty Pass',
    description:
      'Jumper Loyalty Pass is the page explaining the Loyalty Pass system.',
  },
};

export const pageOpenGraph: Record<string, Metadata['openGraph']> = {
  default: {
    title: pageMetadataFields.default.title,
    description: pageMetadataFields.default.description,
    images: [
      {
        url: 'https://jumper.exchange/preview-default.png',
        width: 900,
        height: 450,
      },
    ],
    type: 'website',
    siteName,
  },
  earn: {
    title: pageMetadataFields.earn.title,
    description: pageMetadataFields.earn.description,
    images: [
      {
        url: 'https://jumper.exchange/preview-earn.png',
        width: 900,
        height: 450,
      },
    ],
    type: 'website',
    siteName,
  },
  earnOpportunity: {
    title: pageMetadataFields.earnOpportunity.title,
    description: pageMetadataFields.earnOpportunity.description,
    images: [
      {
        url: 'https://jumper.exchange/preview-earn.png',
        width: 900,
        height: 450,
      },
    ],
    type: 'website',
    siteName,
  },
  portfolio: {
    title: pageMetadataFields.portfolio.title,
    description: pageMetadataFields.portfolio.description,
    images: [
      {
        url: 'https://jumper.exchange/preview-portfolio.png',
        width: 900,
        height: 450,
      },
    ],
    type: 'website',
    siteName,
  },
  profile: {
    title: pageMetadataFields.profile.title,
    description: pageMetadataFields.profile.description,
    images: [
      {
        url: 'https://jumper.exchange/preview-profile.png',
        width: 900,
        height: 450,
      },
    ],
    type: 'website',
    siteName,
  },
};

export const pageTwitter: Record<string, Metadata['twitter']> = {
  default: {
    site: '@JumperExchange',
    title: pageMetadataFields.default.title,
    description: pageMetadataFields.default.description,
    images: 'https://jumper.exchange/preview-default.png',
  },
  earn: {
    site: '@JumperExchange',
    title: pageMetadataFields.earn.title,
    description: pageMetadataFields.earn.description,
    images: 'https://jumper.exchange/preview-earn.png',
  },
  earnOpportunity: {
    site: '@JumperExchange',
    title: pageMetadataFields.earnOpportunity.title,
    description: pageMetadataFields.earnOpportunity.description,
  },
  portfolio: {
    site: '@JumperExchange',
    title: pageMetadataFields.portfolio.title,
    description: pageMetadataFields.portfolio.description,
    images: 'https://jumper.exchange/preview-portfolio.png',
  },
  profile: {
    site: '@JumperExchange',
    title: pageMetadataFields.profile.title,
    description: pageMetadataFields.profile.description,
    images: 'https://jumper.exchange/preview-profile.png',
  },
};

export const baseMiniApp = {
  splashBackgroundColor: '#653ca2',
  iconUrl: 'preview-default.png',
  splashImageUrl: 'favicon.png',
  miniAppName: 'Jumper Mini App',
};

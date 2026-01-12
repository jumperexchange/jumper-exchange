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
      'Earn smarter across chains with Jumper Earn. Access curated earn opportunities, seamless swaps, and capital management in one smart app.',
  },
  earnOpportunity: {
    title: 'Jumper Earn | {{opportunityName}}',
    description:
      'Earn smarter across chains with Jumper Earn. Access curated earn opportunities, seamless swaps, and capital management in one smart app.',
  },
  portfolio: {
    title: 'Jumper Portfolio | Smarter Portfolio Management',
    description:
      'Smarter portfolio management with Jumper Portfolio. Track assets, understand positions, and manage capital in one smart app.',
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
        url: 'https://jumper.exchange/preview.png',
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

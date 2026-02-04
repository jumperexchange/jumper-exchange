import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@/components/PrivacyPolicy/PrivacyPolicyPage';
import { siteName } from 'src/app/lib/metadata';
import { getSiteUrl } from 'src/const/urls';
import { TermsOfBusinessPage } from '@/components/TermsOfBusiness/TermsOfBusinessPage';

export const metadata: Metadata = {
  title: `Terms Of Business | ${siteName}`,
  description:
    'Terms Of Business for Jumper - Learn about the terms and conditions governing your use of our services.',
  openGraph: {
    title: `Terms Of Business | ${siteName}`,
    description:
      'Terms Of Business for Jumper - Learn about the terms and conditions governing your use of our services.',
    url: `${getSiteUrl()}/terms-of-business`,
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Terms Of Business | ${siteName}`,
    description:
      'Terms Of Business for Jumper - Learn about the terms and conditions governing your use of our services.',
  },
  alternates: {
    canonical: `${getSiteUrl()}/terms-of-business`,
  },
};

export const revalidate = 300;

export default function Page() {
  return <TermsOfBusinessPage />;
}

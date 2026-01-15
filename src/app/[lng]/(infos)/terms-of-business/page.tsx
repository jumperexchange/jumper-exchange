import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@/components/PrivacyPolicy/PrivacyPolicyPage';
import { siteName } from 'src/app/lib/metadata';
import { getSiteUrl } from 'src/const/urls';
import { TermsOfBusinessPage } from '@/components/TermsOfBusiness/TermsOfBusinessPage';

// TODO
export const metadata: Metadata = {
  title: `Terms Of Business | ${siteName}`,
  description:
    'Terms Of Business for Jumper Exchange - Learn about the terms and conditions governing your use of our services.',
  openGraph: {
    title: `Privacy Policy | ${siteName}`,
    description:
      'Privacy Policy for Jumper Exchange - Learn how we collect, use, and protect your personal information.',
    url: `${getSiteUrl()}/privacy-policy`,
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Privacy Policy | ${siteName}`,
    description:
      'Privacy Policy for Jumper Exchange - Learn how we collect, use, and protect your personal information.',
  },
  alternates: {
    canonical: `${getSiteUrl()}/privacy-policy`,
  },
};

export const revalidate = 300;

export default function Page() {
  return <TermsOfBusinessPage />;
}

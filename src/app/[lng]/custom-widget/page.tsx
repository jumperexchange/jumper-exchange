import type { Metadata } from 'next';
import CustomWidgetPage from '@/app/ui/custom-widget/CustomWidgetPage';
import { getSiteUrl } from '@/const/urls';

export const metadata: Metadata = {
  title: 'Jumper Custom Widget',
  description:
    'Jumper Custom Widget is the custom widget page of Jumper Exchange.',
  alternates: {
    canonical: `${getSiteUrl()}/custom-widget`,
  },
};

export default async function Page() {
  // hardcoded for now
  const projectData = {
    chain: 'ethereum',
    project: 'mellow',
    address: '0xBEEF69Ac7870777598A04B2bd4771c71212E6aBc',
  };

  return <CustomWidgetPage projectData={projectData} />;
}

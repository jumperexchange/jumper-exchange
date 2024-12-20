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
    chain: 'base',
    project: 'ionic',
    address: '0xa900a17a49bc4d442ba7f72c39fa2108865671f0',
  };

  return <CustomWidgetPage projectData={projectData} />;
}

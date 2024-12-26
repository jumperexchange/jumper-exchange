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
    chain: 'lisk',
    chainId: 1135,
    project: 'beefy',
    integrator: 'zap.beefy',
    address: '0xb3aac1293632706e134e4cc41976b49ec89fab1b',
  };

  return <CustomWidgetPage projectData={projectData} />;
}

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
  return <CustomWidgetPage />;
}

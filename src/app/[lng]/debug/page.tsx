import { type Metadata } from 'next';
import { getSiteUrl } from '@/const/urls';
import { Widget } from '@/components/Widgets/Widget';

export const metadata: Metadata = {
  title: 'Jumper | Superfest',
  description: 'Dive into the Superchain DeFi Festival!',
  alternates: {
    canonical: `${getSiteUrl()}/superfest`,
  },
};

export default async function Page() {
  return (
    <div>
      <Widget starterVariant="default" />
    </div>
  );
}

import { type Metadata } from 'next';
import Superfest from 'src/app/ui/superfest/Superfest';
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
  return <div>TOTO test

  <Widget starterVariant="default"/>
  </div>;
}

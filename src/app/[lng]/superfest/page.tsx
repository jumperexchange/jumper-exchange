import { type Metadata } from 'next';
import Superfest from 'src/app/ui/superfest/Superfest';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Jumper | Superfest';
  const description = 'Dive into the Superchain DeFi Festival!';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: 'https://jumper.exchange/og-superfest.jpg', // Default image
          width: 800,
          height: 420,
        },
      ],
      type: 'website', // Override type
    },
  };
}

export default async function Page() {
  return <Superfest />;
}

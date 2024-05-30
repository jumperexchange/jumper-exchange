import ProfilePage from '../../ui/profile/ProfilePage';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jumper Profile',
    description: 'Jumper Profile is the profile page of Jumper exchange.',
    openGraph: {
      title: 'Jumper Profile',
      description: 'Jumper Profile page where you can see your XP and level.',
      url: 'https://jumper.exchange/profile',
      images: [
        {
          url: 'https://strapi.li.finance/uploads/large_Save_on_Gas_Fees_518a5edcc9.jpg', // Must be an absolute URL
          width: 800,
          height: 600,
          alt: 'small banner image',
        },
        {
          url: 'https://strapi.li.finance/uploads/large_Save_on_Gas_Fees_518a5edcc9.jpg', // Must be an absolute URL
          width: 1800,
          height: 1600,
          alt: 'banner image',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function Page() {
  return <ProfilePage />;
}

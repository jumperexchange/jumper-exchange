import dynamic from 'next/dynamic';
import { generateMetadata } from 'src/app/lib/generateMetadata';

const ProfilePageWrapper = dynamic(
  () => import('../../ui/profile/ProfilePage'),
  {
    ssr: true,
  },
);

// `app/ui/learn/page.tsx` is the UI for the `/learn` URL
export default async function Page() {
  generateMetadata();
  return <ProfilePageWrapper />;
}

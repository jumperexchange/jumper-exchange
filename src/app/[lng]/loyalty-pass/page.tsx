import { LoyaltyPassPage } from 'src/app/ui/loyalty-pass/LoyaltyPassPage';

// `app/ui/learn/page.tsx` is the UI for the `/learn` URL
export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  return <LoyaltyPassPage />;
}

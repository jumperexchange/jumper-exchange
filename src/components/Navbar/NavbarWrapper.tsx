import { BlockedBanner } from '@/jumperFlags/bouncer/BlockedBanner';
import { ClientNavbar } from './ClientNavbar';

// @Note: here we can add the logic for disabling the navbar if needed based on the pathname
export default function NavbarWrapper() {
  return (
    <>
      <BlockedBanner />
      <ClientNavbar />
    </>
  );
}

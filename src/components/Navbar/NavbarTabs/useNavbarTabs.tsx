import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useRouter } from 'next/navigation';

export const useNavbarTabs = () => {
  const { trackEvent } = useUserTracking();
  const router = useRouter();

  const handleClickTab =
    (tab: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      const searchParams = new URLSearchParams(window.location.search);
      let path = searchParams.toString();
      path = path.startsWith('?') ? path.substring(1) : path;

      router.push(`/${tab}?${path}`);
      trackEvent({
        category: TrackingCategory.Navigation,
        action: TrackingAction.SwitchTab,
        label: `switch_tab_to_${tab}`,
        data: { [TrackingEventParameter.Tab]: tab },
        enableAddressable: true,
      });
    };

  const output = [
    {
      label: 'About',
      value: 0,
      onClick: handleClickTab('wash/about'),
    },
    {
      label: 'Wash NFT',
      onClick: handleClickTab('wash'),
      value: 1,
    },
    {
      label: 'Collection',
      onClick: handleClickTab('wash/collection'),
      value: 2,
    },
  ];

  return output;
};

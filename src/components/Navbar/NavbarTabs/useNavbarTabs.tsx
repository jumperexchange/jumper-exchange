import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useRouter } from 'next/navigation';
import { WashLinkMap } from 'src/wash/const/washLinkMap';

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
      onClick: handleClickTab(WashLinkMap.WashAbout),
    },
    {
      label: 'Wash NFT',
      onClick: handleClickTab(WashLinkMap.WashNFT),
      value: 1,
    },
    {
      label: 'Collection',
      onClick: handleClickTab(WashLinkMap.WashCollection),
      value: 2,
    },
  ];

  return output;
};

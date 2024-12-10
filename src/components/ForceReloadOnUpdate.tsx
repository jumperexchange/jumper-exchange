'use client';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

function ForceReloadOnUpdate() {
  const router = useRouter();

  useQuery({
    queryKey: ['forceReloadOnUpdate'],
    queryFn: () =>
      fetch('/meta/_health')
        .then((res) => res.json())
        .then((data) => {
          if (data.hasUpdateAvailable) {
            router.refresh();
          }

          return data;
        }),
    refetchInterval: 1000 * 60 * 60,
  });

  return <></>;
}

export default ForceReloadOnUpdate;

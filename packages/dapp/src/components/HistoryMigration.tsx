import { useEffect } from 'react';

export function HistoryMigration() {
  const targetOrigin = 'https://transferto.xyz';
  useEffect(() => {
    const handler = (event) => {
      if (event.origin === targetOrigin) {
        try {
          const data = JSON.parse(event.data);
          if (Object.keys(data?.state?.routes || {}).length) {
            const localData = JSON.parse(
              localStorage.getItem('jumper-expandable-widget-routes'),
            );
            if (
              !Object.keys(localData?.state?.routes || {}).length ||
              Object.keys(data.state.routes).filter(
                (id) => !Object.keys(localData.state.routes).includes(id),
              ).length
            ) {
              const newData = {
                ...data,
                ...localData,
                state: {
                  ...localData?.state,
                  routes: {
                    ...localData?.state?.routes,
                    ...data.state.routes,
                  },
                },
              };
              localStorage.setItem(
                'jumper-expandable-widget-routes',
                JSON.stringify(newData),
              );
              window.location.reload();
            }
          }
        } catch (error) {
          // ignore
        }
      }
    };
    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);
  return (
    <iframe
      title="history-migration"
      src={`${targetOrigin}/history-migration`}
      width={0}
      height={0}
      scrolling="no"
      marginHeight={0}
      marginWidth={0}
      style={{
        width: 0,
        height: 0,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        border: 0,
      }}
    ></iframe>
  );
}

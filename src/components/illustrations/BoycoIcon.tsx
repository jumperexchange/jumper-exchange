import { useTheme } from '@mui/material';

export function BoycoIcon() {
  const theme = useTheme();

  if (theme.palette.mode === 'light') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 267 117"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M190.689 95.5093V81.4562C199.339 78.4894 205.638 69.2768 205.638 58.3726C205.638 47.4684 199.339 38.2298 190.689 35.289V21.2359C198.835 18.4513 204.91 10.0974 205.582 0H195.672V4.29402C195.672 7.59911 193.657 10.5138 190.689 11.9712V9.96732C190.689 7.02657 188.114 4.63233 184.951 4.63233H184.447C181.284 4.63233 178.708 7.02657 178.708 9.96732V11.9712C175.741 10.5138 173.725 7.62513 173.725 4.29402V0H163.816C164.488 10.0974 170.562 18.4513 178.708 21.2359V35.289C170.086 38.2298 163.76 47.4424 163.76 58.3726C163.76 69.3028 170.058 78.5154 178.708 81.4562V95.5093C170.562 98.2939 164.488 106.648 163.816 116.745H173.725V112.451C173.725 109.146 175.741 106.231 178.708 104.774V106.778C178.708 109.719 181.284 112.113 184.447 112.113H184.951C188.114 112.113 190.689 109.719 190.689 106.778V104.774C193.657 106.231 195.672 109.12 195.672 112.451V116.745H205.582C204.91 106.648 198.835 98.2939 190.689 95.5093ZM173.725 64.5143V52.2048C173.725 48.8997 175.741 45.985 178.708 44.5276V46.5315C178.708 49.4723 181.284 51.8665 184.447 51.8665H184.951C188.114 51.8665 190.689 49.4723 190.689 46.5315V44.5276C193.657 45.985 195.672 48.8737 195.672 52.2048V64.5143C195.672 67.8194 193.657 70.7342 190.689 72.1915V70.1877C190.689 67.2469 188.114 64.8527 184.951 64.8527H184.447C181.284 64.8527 178.708 67.2469 178.708 70.1877V72.1915C175.769 70.7342 173.725 67.8455 173.725 64.5143Z"
          fill="#171717"
        />
        <path
          d="M251.49 65.8416V50.8776C260.14 47.9108 266.439 38.6982 266.439 27.794C266.439 16.8898 260.14 7.65115 251.49 4.7104V0H239.537V4.7104C230.887 7.67717 224.589 16.8898 224.589 27.794C224.589 38.6982 230.887 47.9368 239.537 50.8776V65.8416C230.887 68.8083 224.589 78.021 224.589 88.9252C224.589 99.8294 230.887 109.068 239.537 112.009V116.719H251.49V112.009C260.14 109.042 266.439 99.8294 266.439 88.9252C266.439 78.021 260.14 68.8083 251.49 65.8416ZM234.526 33.9357V21.6262C234.526 18.3211 236.542 15.4064 239.509 13.949V15.9529C239.509 18.8937 242.085 21.2879 245.248 21.2879H245.724C248.887 21.2879 251.462 18.8937 251.462 15.9529V13.949C254.43 15.4064 256.445 18.2951 256.445 21.6262V33.9357C256.445 37.2408 254.43 40.1556 251.462 41.6129V39.609C251.462 36.6683 248.887 34.274 245.724 34.274H245.22C242.057 34.274 239.481 36.6683 239.481 39.609V41.6129C236.57 40.1556 234.526 37.2668 234.526 33.9357ZM256.473 95.0929C256.473 98.398 254.458 101.313 251.49 102.77V99.8294C251.49 96.8886 248.915 94.4944 245.752 94.4944H245.276C242.113 94.4944 239.537 96.8886 239.537 99.8294V102.77C236.57 101.313 234.554 98.424 234.554 95.0929V82.7834C234.554 79.4783 236.57 76.5636 239.537 75.1062V76.1732C239.537 79.114 242.113 81.5082 245.276 81.5082H245.78C248.943 81.5082 251.518 79.114 251.518 76.1732V75.1062C254.486 76.5636 256.501 79.4523 256.501 82.7834V95.0929H256.473Z"
          fill="#171717"
        />
        <path
          d="M122.191 46.4544C122.079 45.8558 121.939 45.2833 121.715 44.7368C121.799 44.6067 140.386 20.5341 123.171 5.64822C105.983 -9.23771 85.9114 10.1765 85.7995 10.2806C82.6082 9.34368 79.389 8.77114 76.1978 8.51089C76.1978 8.51089 76.1978 8.51089 76.1698 8.51089C69.6193 7.49594 60.4375 8.51089 60.4375 8.51089C57.2743 8.77114 54.0831 9.34368 50.9198 10.2545C50.8078 10.1504 30.7366 -9.26373 13.5488 5.62219C-3.63913 20.5081 14.9204 44.6067 15.0044 44.7108C14.8085 45.2833 14.6405 45.8558 14.5285 46.4284C12.681 56.734 0 59.909 0 77.8658C0 96.1609 13.2408 110.578 40.2824 110.578H51.3677C51.4237 110.63 55.7067 116.304 64.5526 116.642C64.5526 116.642 66.5961 116.85 71.2989 116.694C80.6767 116.694 85.2396 110.682 85.2676 110.604H96.3529C123.394 110.604 136.635 96.1869 136.635 77.8918C136.719 59.961 124.038 56.76 122.191 46.4544Z"
          fill="#171717"
        />
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 267 117"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M190.689 95.5093V81.4562C199.339 78.4894 205.638 69.2768 205.638 58.3726C205.638 47.4684 199.339 38.2298 190.689 35.289V21.2359C198.835 18.4513 204.91 10.0974 205.582 0H195.672V4.29402C195.672 7.59911 193.657 10.5138 190.689 11.9712V9.96732C190.689 7.02657 188.114 4.63233 184.951 4.63233H184.447C181.284 4.63233 178.708 7.02657 178.708 9.96732V11.9712C175.741 10.5138 173.725 7.62513 173.725 4.29402V0H163.816C164.488 10.0974 170.562 18.4513 178.708 21.2359V35.289C170.086 38.2298 163.76 47.4424 163.76 58.3726C163.76 69.3028 170.058 78.5154 178.708 81.4562V95.5093C170.562 98.2939 164.488 106.648 163.816 116.745H173.725V112.451C173.725 109.146 175.741 106.231 178.708 104.774V106.778C178.708 109.719 181.284 112.113 184.447 112.113H184.951C188.114 112.113 190.689 109.719 190.689 106.778V104.774C193.657 106.231 195.672 109.12 195.672 112.451V116.745H205.582C204.91 106.648 198.835 98.2939 190.689 95.5093ZM173.725 64.5143V52.2048C173.725 48.8997 175.741 45.985 178.708 44.5276V46.5315C178.708 49.4723 181.284 51.8665 184.447 51.8665H184.951C188.114 51.8665 190.689 49.4723 190.689 46.5315V44.5276C193.657 45.985 195.672 48.8737 195.672 52.2048V64.5143C195.672 67.8194 193.657 70.7342 190.689 72.1915V70.1877C190.689 67.2469 188.114 64.8527 184.951 64.8527H184.447C181.284 64.8527 178.708 67.2469 178.708 70.1877V72.1915C175.769 70.7342 173.725 67.8455 173.725 64.5143Z"
        fill="white"
      />
      <path
        d="M251.49 65.8416V50.8776C260.14 47.9108 266.439 38.6982 266.439 27.794C266.439 16.8898 260.14 7.65115 251.49 4.7104V0H239.537V4.7104C230.887 7.67717 224.589 16.8898 224.589 27.794C224.589 38.6982 230.887 47.9368 239.537 50.8776V65.8416C230.887 68.8083 224.589 78.021 224.589 88.9252C224.589 99.8294 230.887 109.068 239.537 112.009V116.719H251.49V112.009C260.14 109.042 266.439 99.8294 266.439 88.9252C266.439 78.021 260.14 68.8083 251.49 65.8416ZM234.526 33.9357V21.6262C234.526 18.3211 236.542 15.4064 239.509 13.949V15.9529C239.509 18.8937 242.085 21.2879 245.248 21.2879H245.724C248.887 21.2879 251.462 18.8937 251.462 15.9529V13.949C254.43 15.4064 256.445 18.2951 256.445 21.6262V33.9357C256.445 37.2408 254.43 40.1556 251.462 41.6129V39.609C251.462 36.6683 248.887 34.274 245.724 34.274H245.22C242.057 34.274 239.481 36.6683 239.481 39.609V41.6129C236.57 40.1556 234.526 37.2668 234.526 33.9357ZM256.473 95.0929C256.473 98.398 254.458 101.313 251.49 102.77V99.8294C251.49 96.8886 248.915 94.4944 245.752 94.4944H245.276C242.113 94.4944 239.537 96.8886 239.537 99.8294V102.77C236.57 101.313 234.554 98.424 234.554 95.0929V82.7834C234.554 79.4783 236.57 76.5636 239.537 75.1062V76.1732C239.537 79.114 242.113 81.5082 245.276 81.5082H245.78C248.943 81.5082 251.518 79.114 251.518 76.1732V75.1062C254.486 76.5636 256.501 79.4523 256.501 82.7834V95.0929H256.473Z"
        fill="white"
      />
      <path
        d="M122.191 46.4544C122.079 45.8558 121.939 45.2833 121.715 44.7368C121.799 44.6067 140.386 20.5341 123.171 5.64822C105.983 -9.23771 85.9114 10.1765 85.7995 10.2806C82.6082 9.34368 79.389 8.77114 76.1978 8.51089C76.1978 8.51089 76.1978 8.51089 76.1698 8.51089C69.6193 7.49594 60.4375 8.51089 60.4375 8.51089C57.2743 8.77114 54.0831 9.34368 50.9198 10.2545C50.8078 10.1504 30.7366 -9.26373 13.5488 5.62219C-3.63913 20.5081 14.9204 44.6067 15.0044 44.7108C14.8085 45.2833 14.6405 45.8558 14.5285 46.4284C12.681 56.734 0 59.909 0 77.8658C0 96.1609 13.2408 110.578 40.2824 110.578H51.3677C51.4237 110.63 55.7067 116.304 64.5526 116.642C64.5526 116.642 66.5961 116.85 71.2989 116.694C80.6767 116.694 85.2396 110.682 85.2676 110.604H96.3529C123.394 110.604 136.635 96.1869 136.635 77.8918C136.719 59.961 124.038 56.76 122.191 46.4544Z"
        fill="white"
      />
    </svg>
  );
}

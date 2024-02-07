import { useTheme } from '@mui/material/styles';
import { useBanner } from 'src/hooks/useBanner';
import { useSettingsStore } from 'src/stores';

export const Banner = () => {
  const theme = useTheme();

  // Todo: fetch banner from Strapi
  // Check if there is a customer banner; if it is the case we don't show the other
  const { banner, url, isSuccess } = useBanner();

  return banner ? (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
        padding: '10px',
        background: 'rgb(101 0 254 / 10%)',
        fontWeight: 700,
        transition: 'display 2s',
      }}
    >
      {banner?.attributes?.Title}
      <img
        alt=""
        width={24}
        height={24}
        style={{ marginLeft: 8 }}
        src={url.origin + banner?.attributes.Image.data.attributes.url ?? ''}
      />
    </div>
  ) : (
    <></>
  );
};

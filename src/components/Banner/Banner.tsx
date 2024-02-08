import { Slide } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useBanner } from 'src/hooks/useBanner';
import { useSettingsStore } from 'src/stores';

export const Banner = () => {
  const theme = useTheme();

  // Check if there is a customer banner; if it is the case we don't show the other
  const { banner, url, isSuccess } = useBanner();

  const imageUrl = url.origin + banner?.attributes.Image.data.attributes.url;
  const backgroundColor = null ?? 'rgb(101 0 254 / 10%)';

  return banner ? (
    <Slide
      direction="down"
      in={isSuccess}
      unmountOnExit
      appear={true}
      timeout={2000}
      easing={'cubic-bezier(0.32, 0, 0.67, 0)'}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          textAlign: 'center',
          padding: '10px',
          background: backgroundColor,
          fontWeight: 700,
        }}
      >
        {banner?.attributes?.Title}
        <img
          alt=""
          width={24}
          height={24}
          style={{ marginLeft: 8 }}
          src={imageUrl ?? ''}
        />
      </div>
    </Slide>
  ) : null;
};

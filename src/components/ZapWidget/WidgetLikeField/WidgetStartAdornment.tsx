import {
  Avatar as MuiAvatar,
  Box,
  FormHelperText,
  InputLabel,
  Typography,
  useTheme,
  Grid,
  Link,
  Input,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import TokenImage from '@/components/Portfolio/TokenImage';

interface Image {
  url: string;
  name: string;
}

interface WidgetFieldStartAdornmentProps {
  image: Image & { badge?: Image };
}

function WidgetFieldStartAdornment({ image }: WidgetFieldStartAdornmentProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: 'auto',
      }}
    >
      <>
        <WalletCardBadge
          overlap="circular"
          className="badge"
          sx={{ maringRight: '8px' }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={
            image.badge && (
              <MuiAvatar
                alt={image.badge.name}
                sx={(theme: any) => ({
                  width: '18px',
                  height: '18px',
                  border: `2px solid ${theme.palette.surface2.main}`,
                })}
              >
                {image.badge.name && (
                  <TokenImage
                    token={{
                      name: image.badge.name,
                      logoURI: image.badge.url,
                    }}
                  />
                )}
              </MuiAvatar>
            )
          }
        >
          <WalletAvatar>
            {image.name && (
              <TokenImage
                token={{
                  name: image.name,
                  logoURI: image.url,
                }}
              />
            )}
          </WalletAvatar>
        </WalletCardBadge>
      </>
    </Box>
  );
}

export default WidgetFieldStartAdornment;

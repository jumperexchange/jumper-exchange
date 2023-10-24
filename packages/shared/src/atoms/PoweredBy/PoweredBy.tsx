import { Typography, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { Container } from './PoweredBy.style';

export const PoweredBy = () => {
  const theme = useTheme();

  return (
    <Container>
      <Typography
        variant={'lifiBodySmall'}
        sx={{ color: theme.palette.grey[500] }}
      >
        <Trans
          i18nKey={'navbar.poweredByLifi' as string & never[]}
          components={[
            // fix: allow component with "no content"
            // eslint-disable-next-line jsx-a11y/anchor-has-content
            <a
              className={'link-lifi'}
              href="https://li.fi/?utm_source=jumper&utm_medium=powered_by&utm_campaign=jumper_to_lifi"
              target={'_blank'}
              rel="noreferrer"
            />,
          ]}
        />
      </Typography>
    </Container>
  );
};

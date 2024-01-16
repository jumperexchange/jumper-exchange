import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Breakpoint } from '@mui/material';
import { Box, Container, Divider, IconButton, useTheme } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QAJsonSchema } from 'src/components';
import type { FaqMeta } from 'src/types';

interface AccordionFAQProps {
  content: FaqMeta[];
}

export const AccordionFAQ = ({ content }: AccordionFAQProps) => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const handleShowMore = () => {
    setShow(!show);
  };

  return !!content.length ? (
    <Container
      sx={{
        margin: 'auto',
        marginTop: theme.spacing(4),
        padding: theme.spacing(1, 2),
        borderRadius: '8px',
        background: theme.palette.surface1.main,
        position: 'relative',
        maxWidth: theme.breakpoints.values.md,
        width: '100% !important',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)'
            : '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)',

        '&:before': {
          content: '" "',
          zIndex: '-1',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(to top left, #fff 0%, #fff 100% )',
          // transform: 'translate3d(0px, 20px, 0) scale(0.95)',
          filter: 'blur(20px)',
          opacity: 'var(0.7)',
          transition: 'opacity 0.3s',
        },
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          width: theme.breakpoints.values.md,
          maxWidth: theme.breakpoints.values.md,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onClick={() => setShow(!show)}
      >
        <Typography variant="lifiHeaderMedium" m={theme.spacing(2, 0)}>
          {t('blog.faq')}
        </Typography>
        <IconButton
          sx={{
            width: 42,
            height: 42,
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.white.main
                : 'currentColor',
          }}
          onClick={handleShowMore}
        >
          <ExpandMoreIcon sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Box>
      {content?.map((el: FaqMeta, index: number) => (
        <Accordion
          key={`faq-item-${index}`}
          sx={{
            background: 'transparent',
            visibility: show ? 'visible' : 'hidden',
            height: show ? 'auto' : 0,
            '&:last-of-type': {
              marginBottom: show ? theme.spacing(2) : 0,
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            <Typography variant="lifiBodyMediumStrong">
              {el.attributes.Question}
            </Typography>
          </AccordionSummary>
          <Divider
            sx={{
              ...(theme.palette.mode === 'dark' && {
                borderColor: theme.palette.grey[200],
              }),
            }}
          />
          <AccordionDetails sx={{ '& > img': { width: '100%' } }}>
            <BlocksRenderer content={el.attributes.Answer} />
          </AccordionDetails>
        </Accordion>
      ))}
      <QAJsonSchema data={content} />
    </Container>
  ) : null;
};

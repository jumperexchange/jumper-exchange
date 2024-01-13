import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Breakpoint } from '@mui/material';
import { Container, useTheme } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { FaqMeta } from 'src/types';

interface AccordionFAQProps {
  content: FaqMeta[];
}

export const AccordionFAQ = ({ content }: AccordionFAQProps) => {
  const theme = useTheme();
  console.log('CONTENT', content);

  return (
    <Container
      sx={{
        margin: 'auto',
        marginTop: theme.spacing(4),
        padding: theme.spacing(1, 2, 3),
        background: theme.palette.surface1.main,
        position: 'relative',
        maxWidth: theme.breakpoints.values.md,
        width: '100% !important',

        '& > .accordion-item:first-of-type': { marginTop: theme.spacing(2.5) },

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
      <Typography variant="lifiHeaderMedium" mt={theme.spacing(2)}>
        FAQ
      </Typography>
      {content?.map((el: FaqMeta, index: number) => (
        <Accordion key={`faq-item-${index}`} className="accordion-item">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            <Typography>{el.attributes.Question}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ '& > img': { width: '100%' } }}>
            <BlocksRenderer content={el.attributes.Answer} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

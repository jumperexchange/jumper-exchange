import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, IconButton, Typography, alpha, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import type { InstructionItemProps } from '.';

interface InstructionsAccordionItemProps extends InstructionItemProps {
  index: number;
}

export const InstructionsAccordionItem = ({
  title,
  step,
  index,
}: InstructionsAccordionItemProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen:
    | MouseEventHandler<HTMLDivElement | HTMLButtonElement>
    | undefined = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800],
        padding: theme.spacing(3),
        flexDirection: 'column',
        margin: theme.spacing(2, 0),
        borderRadius: '24px',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
        onClick={(e) => handleOpen(e)}
      >
        <Box sx={{ display: 'flex' }}>
          <Typography
            sx={{
              marginLeft: theme.spacing(2),
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '32px',
              color: theme.palette.grey[500],
            }}
          >
            {index + 1}
          </Typography>
          <Typography
            sx={{
              marginLeft: theme.spacing(3),
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '32px',
            }}
          >
            {title}
          </Typography>
        </Box>
        {step ? (
          <IconButton
            onClick={(e) => handleOpen(e)}
            sx={{
              alignSelf: 'center',
              backgroundColor:
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.black.main, 0.04)
                  : theme.palette.alphaLight700.main,
              transition: 'background 0.3s',

              ':hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? alpha(theme.palette.black.main, 0.04)
                    : theme.palette.alphaLight800.main,
              },
            }}
          >
            <ExpandMoreIcon
              sx={{ ...(open && { transform: 'rotate(180deg)' }) }}
            />
          </IconButton>
        ) : null}
      </Box>

      {open ? (
        <Box
          sx={{
            width: '100%',
            marginLeft: theme.spacing(8),
            marginTop: theme.spacing(2),
          }}
        >
          <Typography>{step}</Typography>
        </Box>
      ) : null}
    </Box>
  );
};

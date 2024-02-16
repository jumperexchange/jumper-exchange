import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, IconButton, Typography, alpha, useTheme } from '@mui/material';
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

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(3),
        flexDirection: 'column',
        margin: theme.spacing(2, 0),
        borderRadius: '24px',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', width: '100%' }} onClick={handleOpen}>
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
          onClick={handleOpen}
          sx={{
            alignSelf: 'flex-end',
            position: 'absolute',
            right: theme.spacing(3),
            backgroundColor: alpha(theme.palette.black.main, 0.04),
            top: theme.spacing(2.5),
          }}
        >
          <ExpandMoreIcon
            sx={{ ...(open && { transform: 'rotate(180deg)' }) }}
          />
        </IconButton>
      ) : null}
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

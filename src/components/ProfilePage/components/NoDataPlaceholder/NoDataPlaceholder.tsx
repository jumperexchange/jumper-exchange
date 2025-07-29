'use client';

import { FC } from 'react';

import Typography from '@mui/material/Typography';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import {
  NoDataPlaceholderContainer,
  NoDataPlaceholderDescriptionContainer,
} from './NoDataPlaceholder.style';

interface NoDataPlaceholderProps {
  description: string;
  caption: string;
}

export const NoDataPlaceholder: FC<NoDataPlaceholderProps> = ({
  description,
  caption,
}) => {
  return (
    <NoDataPlaceholderContainer>
      <NoDataPlaceholderDescriptionContainer>
        <Typography variant="bodyMediumStrong" color="textPrimary">
          {description}
        </Typography>
        <SentimentDissatisfiedIcon sx={{ height: 20, width: 20 }} />
      </NoDataPlaceholderDescriptionContainer>
      <Typography variant="bodySmall" color="textSecondary">
        {caption}
      </Typography>
    </NoDataPlaceholderContainer>
  );
};

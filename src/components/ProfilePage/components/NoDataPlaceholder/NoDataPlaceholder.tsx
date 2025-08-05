'use client';

import { FC } from 'react';

import Typography from '@mui/material/Typography';
import {
  NoDataPlaceholderCard,
  NoDataPlaceholderContainer,
  NoDataPlaceholderCta,
  NoDataPlaceholderDescriptionContainer,
} from './NoDataPlaceholder.style';
import Image from 'next/image';
import { Link } from 'src/components/Link';
import { AppPaths } from 'src/const/urls';

interface NoDataPlaceholderProps {
  description: string;
  caption: string;
  ctaText: string;
  ctaLink?: string;
  imageUrl?: string;
}

export const NoDataPlaceholder: FC<NoDataPlaceholderProps> = ({
  description,
  caption,
  ctaText,
  ctaLink,
  imageUrl,
}) => {
  return (
    <NoDataPlaceholderCard>
      <Image
        src={imageUrl ?? '/perks-empty-state.png'}
        alt="No data placeholder"
        width={320}
        height={320}
      />
      <NoDataPlaceholderContainer>
        <NoDataPlaceholderDescriptionContainer>
          <Typography variant="bodyLargeStrong" color="textPrimary">
            {description}
          </Typography>
          <Typography variant="bodyMedium" color="textPrimary">
            {caption}
          </Typography>
        </NoDataPlaceholderDescriptionContainer>
        <NoDataPlaceholderCta component={Link} href={ctaLink ?? AppPaths.Main}>
          {ctaText}
        </NoDataPlaceholderCta>
      </NoDataPlaceholderContainer>
    </NoDataPlaceholderCard>
  );
};

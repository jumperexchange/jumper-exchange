'use client';

import type { FC } from 'react';

import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import {
  NoDataPlaceholderCard,
  NoDataPlaceholderContainer,
  NoDataPlaceholderCta,
  NoDataPlaceholderDescriptionContainer,
} from './NoDataPlaceholder.style';
import Image from 'next/image';
import { Link } from 'src/components/Link/Link';
import { AppPaths } from 'src/const/urls';
import { getResolvedMode } from 'src/utils/image-generation/helpers';

const DEFAULT_HERO = '/perks-empty-hero';

interface NoDataPlaceholderProps {
  description: string;
  caption: string;
  ctaText: string;
  ctaLink?: string;
  // Static, theme-agnostic illustration (full path).
  imageUrl?: string;
  // Base name of a themed pair; resolves to `<heroImage>-light|dark.png`.
  heroImage?: string;
}

export const NoDataPlaceholder: FC<NoDataPlaceholderProps> = ({
  description,
  caption,
  ctaText,
  ctaLink,
  imageUrl,
  heroImage,
}) => {
  const { mode } = useColorScheme();
  const resolvedMode = getResolvedMode(mode);
  const imageSrc =
    imageUrl ?? `${heroImage ?? DEFAULT_HERO}-${resolvedMode}.png`;

  return (
    <NoDataPlaceholderCard>
      <Image
        src={imageSrc}
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

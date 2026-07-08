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

const DEFAULT_HERO = '/perks-empty-hero.png';

// Insert the theme suffix before the file extension so a themed illustration
// can use any format, e.g. `/foo.png` -> `/foo-dark.png`.
const toThemedHeroSrc = (
  hero: string,
  mode: ReturnType<typeof getResolvedMode>,
) => {
  const lastDot = hero.lastIndexOf('.');
  return lastDot === -1
    ? `${hero}-${mode}`
    : `${hero.slice(0, lastDot)}-${mode}${hero.slice(lastDot)}`;
};

interface NoDataPlaceholderProps {
  description: string;
  caption: string;
  ctaText: string;
  ctaLink?: string;
  // Static, theme-agnostic illustration (full path).
  imageUrl?: string;
  // Themed illustration including its extension; the theme suffix is inserted
  // before the extension, e.g. `/foo.png` resolves to `/foo-light.png`.
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
    imageUrl ?? toThemedHeroSrc(heroImage ?? DEFAULT_HERO, resolvedMode);

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

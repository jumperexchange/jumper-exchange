import type { FC } from 'react';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import type { CommonBlockProps, ImageProps } from '../types';
import { RichBlocksVariant } from '../types';

import dynamic from 'next/dynamic';

const Lightbox = dynamic(() =>
  import('src/components/Lightbox/Lightbox').then((mod) => mod.Lightbox),
);

interface ImageBlockProps extends ImageProps, CommonBlockProps {}

export const ImageBlock: FC<ImageBlockProps> = ({ image, variant }) => {
  if (variant !== RichBlocksVariant.BlogArticle) {
    return null;
  }

  const baseUrl = getStrapiBaseUrl();
  if (!baseUrl) {
    return null;
  }
  return <Lightbox imageData={image} baseUrl={baseUrl} />;
};

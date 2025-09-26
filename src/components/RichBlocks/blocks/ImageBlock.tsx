import { FC } from 'react';
import { Lightbox } from 'src/components/Lightbox';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { CommonBlockProps, ImageProps, RichBlocksVariant } from '../types';

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

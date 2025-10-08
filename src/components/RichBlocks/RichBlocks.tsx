import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { FC } from 'react';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { SxProps, Theme } from '@mui/material/styles';
import { HeadingBlock } from './blocks/HeadingBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ImageProps, RichBlocksVariant, TrackingKeys } from './types';

interface RichBlocksProps {
  content: RootNode[] | undefined;
  blockSx?: {
    paragraph?: SxProps<Theme>;
    heading?: SxProps<Theme>;
    quote?: SxProps<Theme>;
    image?: SxProps<Theme>;
  };
  trackingKeys?: TrackingKeys;
  variant?: RichBlocksVariant;
}

// @TODO use this also for blog article
export const RichBlocks: FC<RichBlocksProps> = ({
  content,
  blockSx,
  trackingKeys,
  variant = RichBlocksVariant.Mission,
}) => {
  if (!content) {
    return null;
  }

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        heading: (props) => (
          <HeadingBlock {...props} sx={blockSx?.heading} variant={variant} />
        ),
        paragraph: (props) => (
          <ParagraphBlock
            {...props}
            sx={blockSx?.paragraph}
            trackingKeys={trackingKeys}
            variant={variant}
          />
        ),
        quote: (props) => (
          <QuoteBlock {...props} sx={blockSx?.quote} variant={variant} />
        ),
        image: (props) => (
          <ImageBlock
            {...(props as unknown as ImageProps)}
            sx={blockSx?.image}
            variant={variant}
          />
        ),
      }}
    />
  );
};

import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useMemo, type FC } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { ImageBlock } from './blocks/ImageBlock';
import type { ImageProps, TrackingKeys } from './types';
import { RichBlocksVariant } from './types';
import { createSlugIdGenerator } from '@/utils/richBlocks/createSlugIdGenerator';

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

export const RichBlocks: FC<RichBlocksProps> = ({
  content,
  blockSx,
  trackingKeys,
  variant = RichBlocksVariant.Mission,
}) => {
  const generateHeadingId = useMemo(
    () => createSlugIdGenerator(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content],
  );

  const blocks = useMemo<React.ComponentProps<typeof BlocksRenderer>['blocks']>(
    () => ({
      heading: (props) => {
        const text = (Array.isArray(props.children) ? props.children : [])
          .map((child) => child.props.text ?? '')
          .join('');
        const id = generateHeadingId(text);
        return (
          <HeadingBlock
            {...props}
            id={id}
            sx={blockSx?.heading}
            variant={variant}
          />
        );
      },
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
    }),
    [generateHeadingId, blockSx, trackingKeys, variant],
  );

  if (!content) {
    return null;
  }

  return <BlocksRenderer content={content} blocks={blocks} />;
};

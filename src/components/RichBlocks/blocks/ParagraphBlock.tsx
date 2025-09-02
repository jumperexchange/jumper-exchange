import { FC, PropsWithChildren } from 'react';
import { ParagraphBlockContainer } from '../RichBlocks.style';
import {
  CommonBlockProps,
  ParagraphProps,
  RichBlocksVariant,
  TrackingKeys,
} from '../types';
import { ParagraphRenderer } from '../renderers/ParagraphRenderer';
import { CTARenderer } from '../renderers/CTARenderer';
import { WidgetRenderer } from '../renderers/WidgetRenderer';
import { InstructionsRenderer } from '../renderers/InstructionsRenderer';

interface ParagraphBlockProps extends PropsWithChildren, CommonBlockProps {
  trackingKeys?: TrackingKeys;
}

export const ParagraphBlock: FC<ParagraphBlockProps> = ({
  children,
  sx,
  trackingKeys,
  variant,
}) => {
  if (!Array.isArray(children)) {
    return null;
  }

  if (children.length === 1 && children[0].props.text === '') {
    return null;
  }

  const paragraphChildren = children as Array<{ props: ParagraphProps }>;

  if (
    paragraphChildren[0].props.text.includes('<JUMPER_CTA') &&
    variant === RichBlocksVariant.BlogArticle
  ) {
    return (
      <CTARenderer
        text={paragraphChildren[0].props.text}
        trackingKeys={trackingKeys?.cta}
      />
    );
  }

  if (
    paragraphChildren[0].props.text.includes('<WIDGET') &&
    variant === RichBlocksVariant.BlogArticle
  ) {
    return <WidgetRenderer text={paragraphChildren[0].props.text} />;
  }

  if (
    paragraphChildren[0].props.text.includes('<INSTRUCTIONS') &&
    variant === RichBlocksVariant.BlogArticle
  ) {
    return <InstructionsRenderer text={paragraphChildren[0].props.text} />;
  }

  return (
    <ParagraphBlockContainer sx={sx}>
      {paragraphChildren.map((el, index) => (
        <ParagraphRenderer key={index} element={el} />
      ))}
    </ParagraphBlockContainer>
  );
};

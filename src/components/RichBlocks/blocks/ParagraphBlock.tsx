import type { FC, PropsWithChildren } from 'react';
import { ParagraphBlockContainer } from '../RichBlocks.style';
import type { CommonBlockProps, ParagraphProps, TrackingKeys } from '../types';
import { RichBlocksVariant } from '../types';
import dynamic from 'next/dynamic';
import { parseMarkdownTable } from '../utils/parseMarkdownTable';

const ParagraphRenderer = dynamic(() =>
  import('../renderers/ParagraphRenderer').then((mod) => mod.ParagraphRenderer),
);

const CTARenderer = dynamic(() =>
  import('../renderers/CTARenderer').then((mod) => mod.CTARenderer),
);

const WidgetRenderer = dynamic(() =>
  import('../renderers/WidgetRenderer').then((mod) => mod.WidgetRenderer),
);

const InstructionsRenderer = dynamic(() =>
  import('../renderers/InstructionsRenderer').then(
    (mod) => mod.InstructionsRenderer,
  ),
);

const TableRenderer = dynamic(() =>
  import('../renderers/TableRenderer').then((mod) => mod.TableRenderer),
);

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

  const tableData = parseMarkdownTable(paragraphChildren[0].props.text);
  if (tableData) {
    return <TableRenderer headers={tableData.headers} rows={tableData.rows} />;
  }

  return (
    <ParagraphBlockContainer sx={sx}>
      {paragraphChildren.map((el, index) => (
        <ParagraphRenderer key={index} element={el} />
      ))}
    </ParagraphBlockContainer>
  );
};

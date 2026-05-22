import type { FC, PropsWithChildren, ReactNode } from 'react';
import { ParagraphBlockContainer } from '../RichBlocks.style';
import type {
  CommonBlockProps,
  CustomRenderer,
  ParagraphProps,
  TrackingKeys,
} from '../types';
import { RichBlocksVariant } from '../types';
import dynamic from 'next/dynamic';
import { renderTableCellFromSegments } from '../renderers/renderTableCellFromSegments';
import {
  parseMarkdownTable,
  parseMarkdownTableWithRanges,
} from '../utils/parseMarkdownTable';
import {
  buildPositionedInlineParts,
  serializeParagraphInlinesFromReact,
} from '../utils/serializeParagraphInlinesFromReact';

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
  customRenderer?: CustomRenderer;
}

export const ParagraphBlock: FC<ParagraphBlockProps> = ({
  children,
  sx,
  customRenderer,
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
  const firstText = String(paragraphChildren[0]?.props?.text ?? '');

  if (
    firstText.includes('<JUMPER_CTA') &&
    variant === RichBlocksVariant.BlogArticle
  ) {
    return <CTARenderer text={firstText} trackingKeys={trackingKeys?.cta} />;
  }

  if (
    firstText.includes('<WIDGET') &&
    variant === RichBlocksVariant.BlogArticle
  ) {
    return <WidgetRenderer text={firstText} />;
  }

  if (
    firstText.includes('<INSTRUCTIONS') &&
    variant === RichBlocksVariant.BlogArticle
  ) {
    return <InstructionsRenderer text={firstText} />;
  }

  if (customRenderer && customRenderer.validator(firstText)) {
    return customRenderer.render(firstText);
  }

  const inlineNodes = children as ReactNode[];
  const tablePlain = serializeParagraphInlinesFromReact(inlineNodes);
  const tableData = parseMarkdownTable(tablePlain);
  if (tableData) {
    const { plain, positioned } = buildPositionedInlineParts(inlineNodes);
    const work = plain.trim();
    const lead = plain.length - plain.trimStart().length;
    const withRanges = parseMarkdownTableWithRanges(work);

    if (withRanges && positioned.length > 0) {
      const mapCell = (r: { start: number; end: number }) =>
        renderTableCellFromSegments(
          plain,
          positioned,
          lead + r.start,
          lead + r.end,
        );
      return (
        <TableRenderer
          headers={withRanges.headerCellRanges.map(mapCell)}
          rows={withRanges.dataRowCellRanges.map((row) => row.map(mapCell))}
        />
      );
    }
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

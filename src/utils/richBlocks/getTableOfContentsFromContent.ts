import type { BlocksContent } from '@strapi/blocks-react-renderer';
import { isValidHeadingLevel } from './isValidHeadingLevel';
import { getTextFromChildren } from './getTextFromChildren';
import { createSlugIdGenerator } from './createSlugIdGenerator';
import type { BlockChild, HeadingNode } from './types';

export interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
}

function isHeadingNode(
  node: BlocksContent[number],
): node is BlocksContent[number] & HeadingNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as { type?: string }).type === 'heading'
  );
}

export function getTableOfContentsFromContent(
  content: BlocksContent | undefined,
): TableOfContentsItem[] {
  if (!Array.isArray(content)) {
    return [];
  }

  const generateId = createSlugIdGenerator();
  const items: TableOfContentsItem[] = [];

  for (const node of content) {
    if (!isHeadingNode(node)) {
      continue;
    }

    const level = isValidHeadingLevel(node.level) ? node.level : 1;
    const text = getTextFromChildren(node.children as BlockChild[]).trim();

    if (!text) {
      continue;
    }

    items.push({ id: generateId(text), level, text });
  }

  return items;
}

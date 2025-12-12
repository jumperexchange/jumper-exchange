import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';

interface TruncateResult {
  content: RootNode[];
  isTruncated: boolean;
}

const getTextFromNode = (node: unknown): string => {
  if (typeof node !== 'object' || node === null) {
    return '';
  }

  if ('text' in node && typeof node.text === 'string') {
    return node.text;
  }

  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(getTextFromNode).join('');
  }

  return '';
};

export const countChars = (nodes: RootNode[]): number =>
  nodes.reduce((sum, node) => sum + getTextFromNode(node).length, 0);

export const truncateRichText = (
  nodes: RootNode[],
  maxChars: number,
): TruncateResult => {
  if (countChars(nodes) <= maxChars) {
    return { content: nodes, isTruncated: false };
  }

  let remaining = maxChars;

  const truncateNode = (node: unknown): unknown => {
    if (remaining <= 0) {
      return null;
    }

    if (typeof node !== 'object' || node === null) {
      return node;
    }

    if ('text' in node && typeof node.text === 'string') {
      const text = node.text;
      if (text.length <= remaining) {
        remaining -= text.length;
        return node;
      }
      const truncated = text.slice(0, remaining) + '...';
      remaining = 0;
      return { ...node, text: truncated };
    }

    if ('children' in node && Array.isArray(node.children)) {
      const children = node.children.map(truncateNode).filter(Boolean);
      return children.length > 0 ? { ...node, children } : null;
    }

    return node;
  };

  const content = nodes.map(truncateNode).filter(Boolean) as RootNode[];

  return { content, isTruncated: true };
};

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { flatMap } from 'lodash';
import type { InlinePart, InlineTextProps } from './inlinePartTypes';

type Recurse = (n: ReactNode) => InlinePart[];

/**
 * Public for tests; re-exported from serialize module.
 */
export function inlinePartsToPlainString(parts: InlinePart[]): string {
  return parts.map((x) => (x.kind === 'text' ? x.value : x.label)).join('');
}

function readTextStyleProps(p: Record<string, unknown>): InlineTextProps {
  return {
    bold: p.bold as boolean | undefined,
    italic: p.italic as boolean | undefined,
    underline: p.underline as boolean | undefined,
    strikethrough: p.strikethrough as boolean | undefined,
  };
}

const strapiTextHandler = {
  predicate: (el: ReactElement<Record<string, unknown>>) =>
    typeof el.props.text === 'string',
  toParts: (el: ReactElement<Record<string, unknown>>, _walk: Recurse) => {
    const p = el.props;
    return [
      {
        kind: 'text' as const,
        value: p.text as string,
        textProps: readTextStyleProps(p as Record<string, unknown>),
      },
    ];
  },
};

const strapiContentLinkHandler = {
  predicate: (el: ReactElement<Record<string, unknown>>) => {
    const c = el.props.content;
    return (
      c != null &&
      typeof c === 'object' &&
      (c as { type?: string }).type === 'link' &&
      typeof (c as { url?: string }).url === 'string'
    );
  },
  toParts: (el: ReactElement<Record<string, unknown>>, _walk: Recurse) => {
    const c = el.props.content as {
      url: string;
      children: Array<{ text?: string }>;
    };
    const { url, children: linkChildren = [] } = c;
    const label = linkChildren.map((x) => x.text ?? '').join('');
    return [{ kind: 'link' as const, url, label }];
  },
};

const hrefLinkHandler = {
  predicate: (el: ReactElement<Record<string, unknown>>) =>
    typeof el.props.href === 'string',
  toParts: (el: ReactElement<Record<string, unknown>>, walk: Recurse) => {
    const ch = el.props.children;
    const inner = flatMap(Children.toArray(ch as ReactNode), (n) => walk(n));
    return [
      {
        kind: 'link' as const,
        url: el.props.href as string,
        label: inlinePartsToPlainString(inner),
      },
    ];
  },
};

const childrenRecursionHandler = {
  predicate: (el: ReactElement<Record<string, unknown>>) =>
    el.props.children != null,
  toParts: (el: ReactElement<Record<string, unknown>>, walk: Recurse) =>
    flatMap(Children.toArray(el.props.children as ReactNode), (n) => walk(n)),
};

/**
 * OCP: add new entry here for new Strapi inline node shapes; do not change core walk.
 */
const INLINE_NODE_HANDLERS: ReadonlyArray<{
  predicate: (el: ReactElement<Record<string, unknown>>) => boolean;
  toParts: (
    el: ReactElement<Record<string, unknown>>,
    walk: Recurse,
  ) => InlinePart[];
}> = [
  strapiTextHandler,
  strapiContentLinkHandler,
  hrefLinkHandler,
  childrenRecursionHandler,
];

export function walkInlines(node: ReactNode): InlinePart[] {
  if (node == null || node === false) {
    return [];
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return [{ kind: 'text', value: String(node), textProps: {} }];
  }
  if (!isValidElement(node)) {
    return [];
  }
  const el = node as ReactElement<Record<string, unknown>>;
  for (const h of INLINE_NODE_HANDLERS) {
    if (h.predicate(el)) {
      return h.toParts(el, walkInlines);
    }
  }
  return [];
}

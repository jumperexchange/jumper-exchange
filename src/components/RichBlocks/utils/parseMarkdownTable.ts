/**
 * Parses GitHub-flavored markdown table text (pipe rows + delimiter row).
 * Strapi Blocks store this as plain text in a paragraph, not as structured table nodes.
 */

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

const splitRow = (line: string): string[] => {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) {
    return [];
  }

  return trimmed
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
};

const isDelimiterRow = (cells: string[]): boolean =>
  cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));

export const parseMarkdownTable = (text: string): ParsedTable | null => {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  const headers = splitRow(lines[0]);
  if (headers.length === 0) {
    return null;
  }

  const delimiterCells = splitRow(lines[1]);
  if (
    !isDelimiterRow(delimiterCells) ||
    delimiterCells.length !== headers.length
  ) {
    return null;
  }

  const rows = lines.slice(2).reduce<string[][]>((acc, line) => {
    const cells = splitRow(line);
    if (cells.length === 0) {
      return acc;
    }

    const padded = Array.from(
      { length: headers.length },
      (_, i) => cells[i] ?? '',
    );
    return [...acc, padded];
  }, []);

  return { headers, rows };
};

/**
 * Parses GitHub-flavored markdown table text (pipe rows + delimiter row).
 * Strapi Blocks store this as plain text in a paragraph, not as structured table nodes.
 */

import { compact, times } from 'lodash';
import {
  forEachLine,
  getCellCharRangesInLine,
  isDelimiterRow,
  splitRow,
  type CellCharRange,
} from './tableRowUtils';

export type { CellCharRange } from './tableRowUtils';
export { splitRow };

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

export const parseMarkdownTable = (text: string): ParsedTable | null => {
  const lines = compact(
    text
      .trim()
      .split(/\r?\n/)
      .map((l) => l.trim()),
  );

  if (lines.length < 2) {
    return null;
  }

  const headers = splitRow(lines[0]!);
  if (headers.length === 0) {
    return null;
  }

  const delimiterCells = splitRow(lines[1]!);
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

    const padded = times(headers.length, (i) => cells[i] ?? '');
    return [...acc, padded];
  }, []);

  return { headers, rows };
};

export interface ParsedTableWithRanges extends ParsedTable {
  /** Indices into the trimmed `text` passed in. */
  headerCellRanges: CellCharRange[];
  dataRowCellRanges: CellCharRange[][];
}

/**
 * As parseMarkdownTable, plus [start, end) per cell in the same trimmed `text` space.
 */
export const parseMarkdownTableWithRanges = (
  text: string,
): ParsedTableWithRanges | null => {
  const work = text.trim();
  const lineEntries: { t: string; start: number }[] = [];
  forEachLine(work, (lineTrim, lineStart) => {
    lineEntries.push({ t: lineTrim, start: lineStart });
  });

  if (lineEntries.length < 2) {
    return null;
  }
  const [first, second, ...dataLines] = lineEntries;
  if (!first || !second) {
    return null;
  }
  const headers = splitRow(first.t);
  if (headers.length === 0) {
    return null;
  }
  const delimiterCells = splitRow(second.t);
  if (
    !isDelimiterRow(delimiterCells) ||
    delimiterCells.length !== headers.length
  ) {
    return null;
  }

  const headerCellRanges = getCellCharRangesInLine(first.t, first.start);
  if (headerCellRanges.length < headers.length) {
    for (let i = headerCellRanges.length; i < headers.length; i++) {
      headerCellRanges.push({
        start: first.start + first.t.length,
        end: first.start + first.t.length,
      });
    }
  }

  const rows: string[][] = [];
  const dataRowCellRanges: CellCharRange[][] = [];
  for (const { t: line, start: lineStart } of dataLines) {
    const cells = splitRow(line);
    if (cells.length === 0) {
      continue;
    }
    const padded = times(headers.length, (j) => cells[j] ?? '');
    const ranges = getCellCharRangesInLine(line, lineStart);
    const paddedRanges: CellCharRange[] = times(headers.length, (j) => {
      if (j < ranges.length) {
        return ranges[j]!;
      }
      const last = lineStart + line.length;
      return { start: last, end: last };
    });
    rows.push(padded);
    dataRowCellRanges.push(paddedRanges);
  }

  return { headers, rows, headerCellRanges, dataRowCellRanges };
};

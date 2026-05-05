import { take } from 'lodash';

export const splitRow = (line: string): string[] => {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) {
    return [];
  }

  return trimmed
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
};

export const isDelimiterRow = (cells: string[]): boolean =>
  cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));

export type CellCharRange = {
  start: number;
  end: number;
};

/**
 * Ranges in the trimmed work string.
 */
export const getCellCharRangesInLine = (
  t: string,
  lineStartInWork: number,
): CellCharRange[] => {
  const cells = splitRow(t);
  if (cells.length === 0) {
    return [];
  }
  const u = t;
  if (!u.includes('|')) {
    return [];
  }
  const hasLead = u[0] === '|';
  const hasTrail = u[u.length - 1] === '|';
  const i0 = hasLead ? 1 : 0;
  const innerT = u.slice(i0, u.length - (hasTrail ? 1 : 0));
  const parts = innerT.split('|');
  if (parts.length < cells.length) {
    return cells.map(() => ({ start: lineStartInWork, end: lineStartInWork }));
  }
  const out: CellCharRange[] = [];
  let cpos = i0;
  for (let k = 0; k < parts.length; k++) {
    if (k > 0) {
      cpos += 1;
    }
    const part = parts[k]!;
    if (k >= cells.length) {
      cpos += part.length;
      continue;
    }
    const firstNonWs = part.search(/\S/);
    const lead = firstNonWs < 0 ? 0 : firstNonWs;
    let lastNonWs = -1;
    for (let i = part.length - 1; i >= 0; i--) {
      if (part[i] !== ' ' && part[i] !== '\t') {
        lastNonWs = i;
        break;
      }
    }
    if (lastNonWs < 0) {
      out.push({ start: lineStartInWork, end: lineStartInWork });
    } else {
      out.push({
        start: lineStartInWork + cpos + lead,
        end: lineStartInWork + cpos + lastNonWs + 1,
      });
    }
    cpos += part.length;
  }
  if (out.length < cells.length) {
    for (let i = out.length; i < cells.length; i++) {
      out.push({
        start: lineStartInWork + u.length,
        end: lineStartInWork + u.length,
      });
    }
  }
  return take(out, cells.length);
};

export function forEachLine(
  work: string,
  onLine: (lineTrimmed: string, lineStartInWork: number) => void,
) {
  let i = 0;
  while (i < work.length) {
    let end = i;
    while (end < work.length && work[end] !== '\n' && work[end] !== '\r') {
      end += 1;
    }
    const rawLine = work.slice(i, end);
    const lineTrim = rawLine.trim();
    if (lineTrim) {
      const lineStart = i + (rawLine.length - rawLine.trimStart().length);
      onLine(lineTrim, lineStart);
    }
    i = end;
    if (i < work.length) {
      if (work[i] === '\r' && work[i + 1] === '\n') {
        i += 2;
      } else {
        i += 1;
      }
    }
  }
}

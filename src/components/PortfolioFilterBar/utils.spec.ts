import { describe, expect, it } from 'vitest';
import { mergeChainTokenSelection, selectExclusiveFilter } from './utils';

describe('selectExclusiveFilter', () => {
  it('clears the sibling when a selection is made', () => {
    expect(selectExclusiveFilter(['1', '137'], ['1:0xabc'])).toEqual({
      selected: ['1', '137'],
      sibling: [],
    });
  });

  it('leaves the sibling untouched when clearing back to empty', () => {
    expect(selectExclusiveFilter([], ['1:0xabc'])).toEqual({
      selected: [],
      sibling: ['1:0xabc'],
    });
  });
});

describe('mergeChainTokenSelection', () => {
  it('replaces the selection of the edited chain and keeps other chains', () => {
    expect(
      mergeChainTokenSelection(['1:0xaaa', '137:0xbbb'], '1:', [
        '1:0xccc',
        '1:0xddd',
      ]),
    ).toEqual(['137:0xbbb', '1:0xccc', '1:0xddd']);
  });

  it('removes the edited chain tokens when its new selection is empty', () => {
    expect(
      mergeChainTokenSelection(['1:0xaaa', '137:0xbbb'], '1:', []),
    ).toEqual(['137:0xbbb']);
  });

  it('does not confuse chains sharing a numeric prefix', () => {
    expect(mergeChainTokenSelection(['13:0xaaa'], '1:', ['1:0xccc'])).toEqual([
      '13:0xaaa',
      '1:0xccc',
    ]);
  });
});

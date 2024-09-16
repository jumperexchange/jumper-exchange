import type { ReactElement } from 'react';
import { createElement, Fragment } from 'react';

const newlineToBr = (str: unknown): (string | ReactElement)[] => {
  if (typeof str !== 'string') {
    return [String(str)];
  }

  return str.split(/(\r\n|\r|\n)/g).map((line, index) => {
    if (line.match(/(\r\n|\r|\n)/g)) {
      return createElement('br', { key: index });
    }
    return createElement(Fragment, { key: index }, line);
  });
};

export default newlineToBr;

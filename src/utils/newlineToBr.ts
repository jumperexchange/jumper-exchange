import { createElement, Fragment } from 'react';

const newlineToBr = (str: any) => {
  if (typeof str !== 'string') {
    return str;
  }

  return str.split(/(\r\n|\r|\n)/g).map((line, index) => {
    if (line.match(/(\r\n|\r|\n)/g)) {
      return createElement('br', { key: index });
    }
    return createElement(Fragment, { key: index }, line);
  });
};

export default newlineToBr;

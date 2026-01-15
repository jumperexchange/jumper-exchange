import type { JSX } from 'react';
import { styled } from '@mui/material/styles';

const RomanOrderedList = styled('ol')(({ theme }) => ({
  listStyleType: 'lower-roman',
  listStylePosition: 'inside',
  marginTop: theme.spacing(1),
  '& li': {
    marginBottom: theme.spacing(0.5),
  },
}));

const LetterOrderedList = styled('ol')(({ theme }) => ({
  listStyleType: 'lower-alpha',
  listStylePosition: 'outside',
  marginTop: theme.spacing(1),
  paddingLeft: theme.spacing(3),
  '& li': {
    marginBottom: theme.spacing(0.5),
  },
  '& li::marker': {
    fontWeight: 'bold',
  },
}));

type ItemContent = string | JSX.Element;

export function orderedListWithSmallRomanNumbers(...items: ItemContent[]) {
  return (
    <RomanOrderedList>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </RomanOrderedList>
  );
}

export function orderedListWithSmallLetters(
  ...items: { title?: ItemContent | undefined; description: ItemContent }[]
) {
  return (
    <LetterOrderedList>
      {items.map((item, index) => (
        <li key={index}>
          {item.title && (
            <>
              <strong>{item.title}</strong>
              <br />
            </>
          )}
          {item.description}
        </li>
      ))}
    </LetterOrderedList>
  );
}

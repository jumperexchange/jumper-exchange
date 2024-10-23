import styled from '@emotion/styled';
import { inter } from 'src/fonts/fonts';
import { titanOne } from '../common/fonts';

export type TColor =
  | 'violet'
  | 'cyan'
  | 'pink'
  | 'green'
  | 'orange'
  | 'red'
  | 'blue'
  | 'brown'
  | 'gold';

export const colors: Record<TColor, Record<number, string>> = {
  violet: {
    100: '#1B1036',
    200: '#28065F',
    300: '#390083',
    400: '#420097',
    500: '#4200A4',
    600: '#5500BF',
    700: '#7200E5',
    800: '#8000FF',
  },
  pink: {
    200: '#46007E',
    300: '#5A0081',
    400: '#6F0085',
    500: '#830088',
    600: '#98008C',
    700: '#D60096',
    800: '#FF009D',
  },
  cyan: {
    200: '#2C1281',
    300: '#272488',
    400: '#22378F',
    500: '#1D4996',
    600: '#195B9C',
    700: '#0A92B1',
    800: '#00B6BF',
  },
  green: {
    200: '#1D9900',
    800: '#30FF00',
  },
  orange: {
    200: '#99620F',
    700: '#FF7A00',
    800: '#FF7A00',
  },
  red: {
    200: '#992E42',
    800: '#FF4D6D',
  },
  blue: {
    200: '#007F99',
    800: '#00D4FF',
  },
  brown: {
    200: '#875A00',
    800: '#ED9E00',
  },
  gold: {
    800: '#FFC306',
  },
};

export const Absolute = styled.div<{
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
}>`
  position: absolute;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  right: ${({ right }) => right};
  bottom: ${({ bottom }) => bottom};
`;

export const WashText = styled.p`
  font-family: ${inter.style.fontFamily};
`;

export const WashH1 = styled.h1`
  font-family: ${titanOne.style.fontFamily};
  font-size: 32px;
  line-height: 40px;
  text-transform: uppercase;
  color: white;
`;

export const WashH2 = styled.h2`
  font-family: ${titanOne.style.fontFamily};
  font-size: 24px;
  line-height: 32px;
  text-transform: uppercase;
  color: white;
`;

export const SkewX6 = styled.div`
  transform: skewX(-6deg);
`;

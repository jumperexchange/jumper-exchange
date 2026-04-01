import 'i18next';
import Resources from './resources';

type CustomInterpolationFormatTypeMap = {
  [K in `currencyExt${string}`]: number;
} & {
  [K in `decimalExt${string}`]: number;
} & {
  [K in `percentExt${string}`]: number;
} & {
  [K in `dateExt${string}`]: Date;
};

declare module 'i18next' {
  interface CustomTypeOptions {
    // defaultNS: 'translation'
    resources: Resources;
    interpolationFormatTypeMap: CustomInterpolationFormatTypeMap;
  }
}

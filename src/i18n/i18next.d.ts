import 'i18next';
import Resources from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    // defaultNS: 'translation'
    resources: Resources;
    interpolationFormatTypeMap: {
      [key: `decimalExt${string}`]: number;
      [key: `currencyExt${string}`]: number;
      [key: `percentExt${string}`]: number;
      [key: `dateExt${string}`]: Date;
    };
  }
}

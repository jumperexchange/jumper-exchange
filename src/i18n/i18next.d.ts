import 'i18next';
import Resources from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    // defaultNS: 'translation'
    resources: Resources;
    interpolationFormatTypeMap: {
      [K in `currencyExt${string}` | `decimalExt${string}` | `percentExt${string}`]: number;
    } & {
      [K in `dateExt${string}`]: Date;
    };
  }
}

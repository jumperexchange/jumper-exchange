const toDisplayString = (item: unknown, prop?: string): string => {
  if (prop) {
    if (item !== null && typeof item === 'object' && prop in item) {
      return String((item as Record<string, unknown>)[prop]);
    }
    return '';
  }
  return item == null ? '' : String(item);
};

/**
 * i18next formatter joining an array into a string, e.g.
 * `{{items, listExt}}` → "a, b, c". Pass `prop` to pluck a field from an array
 * of objects (`{{perks, listExt(prop: name)}}` → "Fee discount, Priority
 * support") and `separator` to override the default `", "`. Non-arrays and
 * empty items render as nothing.
 */
export const listFormatter =
  (
    _lng: string | undefined,
    options: { prop?: string; separator?: string } = {},
  ) =>
  (value: unknown) => {
    if (!Array.isArray(value)) {
      return '';
    }
    return value
      .map((item) => toDisplayString(item, options.prop))
      .filter(Boolean)
      .join(options.separator ?? ', ');
  };

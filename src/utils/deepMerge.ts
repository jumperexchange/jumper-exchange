const isObject = (obj: any) => obj && typeof obj === 'object';

export const deepMerge = (...objects: any[]) => {
  return objects.reduce((prev, obj) => {
    for (const key in obj) {
      if (isObject(prev[key]) && isObject(obj[key])) {
        prev[key] = deepMerge(prev[key], obj[key]);
      } else {
        prev[key] = obj[key];
      }
    }
    return prev;
  }, {});
};

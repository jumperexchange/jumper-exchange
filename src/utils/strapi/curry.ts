// Curry function
export const curry = (fn, ...args) => {
  return (...next) => {
    const allArgs = args.concat(next);
    if (allArgs.length >= fn.length) {
      return fn(...allArgs);
    } else {
      return curry(fn, ...allArgs);
    }
  };
};

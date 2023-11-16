/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

/**
 * @description:  是否为函数
 */
export function isFunction(val: unknown) {
  return is(val, 'Function');
}

/**
 * @description: 是否为对象
 */
export function isObject(val: any) {
  return val !== null && is(val, 'Object');
}

/**
 * @description:  是否为promise
 */
export function isPromise(val: any) {
  return (
    is(val, 'Promise') &&
    isObject(val) &&
    isFunction(val.then) &&
    isFunction(val.catch)
  );
}

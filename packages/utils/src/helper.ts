/**
 * 为参数设置默认值
 * @param obj 需要设置参数的对象
 * @param prop 需要设置默认值的参数名
 * @param factory 默认值函数
 */
export const F = <T>(obj: { [key: string]: T }, prop: string, factory: () => T) => {
  if (obj[prop] === undefined) {
    obj[prop] = factory();
  }
};

/**
 * 为参数设置默认值
 * @param obj 需要设置参数的对象
 * @param prop 需要设置默认值的参数名
 * @param value 默认值
 */
export const D = <V, K extends keyof V>(obj: V, key: K, value: V[K]) => {
  if (obj[key] === undefined) {
    obj[key] = value;
  }
};

/**
 * 为参数重置值
 * @param obj
 * @param prop
 * @param value
 */
export const R = <V, K extends keyof V>(obj: V, key: K, value: V[K]) => {
  obj[key] = value;
};

/**
 * 为参数设置比例
 * @param obj
 * @param prop
 */
export const S = <V, K extends keyof V>(obj: V, key: K) => {
  const scale = Math.max(window.devicePixelRatio ?? 1, 2);
  const v = obj[key];
  if (Array.isArray(v)) {
    v.forEach((d, i) => {
      v[i] = d * scale;
    });
  } else if (typeof v === 'number') {
    obj[key] = (v * scale) as V[K];
  }
};

/**
 * 缩小参数
 * @param obj
 * @param prop
 */
export const Z = (obj: { [key: string]: number[] | number }, prop: string) => {
  const scale = Math.max(window.devicePixelRatio ?? 1, 2);
  const v = obj[prop];
  if (Array.isArray(v)) {
    v.forEach((d, i) => {
      v[i] = d / scale;
    });
  } else {
    obj[prop] = v / scale;
  }
};

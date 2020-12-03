export function thenable<T>(obj: any): obj is PromiseLike<T> {
  return obj && typeof obj === 'object' && obj.then;
}

export function isXHR(obj: any): obj is XMLHttpRequest {
  return obj instanceof XMLHttpRequest;
}

export { isObject } from 'lodash-es';

export function toFixedNumber(value: number, precision: number) {
  const times = (10 ** precision) || 1;
  return Math.round(value * times / times);
}
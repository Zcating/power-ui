export function thenable<T>(obj: any): obj is PromiseLike<T> {
  return obj && typeof obj === 'object' && obj.then;
}

export function isXHR(obj: any): obj is XMLHttpRequest {
  return obj instanceof XMLHttpRequest;
}

export { isObject } from 'lodash-es';


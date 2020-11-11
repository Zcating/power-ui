import { WatchStopHandle, watch, WatchSource, WatchCallback } from "vue";



type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : T[K] extends Record<string, unknown> ? T[K] : never;
};

export function fastWatch<T extends Readonly<Array<WatchSource<unknown> | Record<string, unknown>>>>(sources: T, cb: WatchCallback<MapSources<T>, MapSources<T>>): WatchStopHandle;

export function fastWatch<T>(source: WatchSource<T>, cb: WatchCallback<T, T | undefined>): WatchStopHandle;

export function fastWatch<T extends Record<string, unknown>>(value: T, fn: WatchCallback<T, T | undefined>): WatchStopHandle {
  return watch(value, fn, {immediate: true});
}
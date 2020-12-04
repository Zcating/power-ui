import { VNode } from 'vue';

export function noop(...args: any) { return; }

export type CdkAny = any;


export type VueNode = VNode | JSX.Element;


export type Renderable = VueNode | number | string | boolean;

export type MaybeArray<T> = T | T[]

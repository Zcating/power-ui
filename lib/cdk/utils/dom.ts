import { VNode } from 'vue';

export function addEvent<T extends Element | Document, K extends keyof HTMLElementEventMap>(target: T, type: K, fn: (this: T, event: HTMLElementEventMap[K]) => void) {
  target.addEventListener(type, fn as any);
  return function destroy() {
    target.removeEventListener(type, fn as any);
  }
}

export const isValidElement = (element: any) => {
  return element && typeof element === 'object' && element['__v_isVNode'] && typeof element.type !== 'symbol';
}

export function getElement(element: any): HTMLElement | null {
  if (element instanceof HTMLElement) {
    return element;
  }
  if (element && element.$el instanceof HTMLElement) {
    return element.$el;
  }
  return null;
}

export const renderCondition = (test: unknown, node: VNode | JSX.Element | undefined, elseNode?: VNode | JSX.Element | undefined) => !!test ? node : elseNode;

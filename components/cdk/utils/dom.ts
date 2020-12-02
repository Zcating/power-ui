import { VNode } from 'vue';

export function addEvent<T extends Element | Document | Window, K extends keyof HTMLElementEventMap>(target: T, type: K | K[], fn: (this: T, event: HTMLElementEventMap[K]) => void) {
  if (Array.isArray(type)) {
    for (const key of type) {
      target.addEventListener(key, fn as any);
    }
    return function () {
      for (const key of type) {
        target.removeEventListener(key, fn as any);
      }
    };
  } else {
    target.addEventListener(type, fn as any);
    return function destroy() {
      target.removeEventListener(type, fn as any);
    };
  }
}

export const isValidElement = (element: any) => {
  return element && typeof element === 'object' && element['__v_isVNode'] && typeof element.type !== 'symbol';
};

export function getElement(element: any): HTMLElement | null {
  if (element instanceof HTMLElement) {
    return element;
  }
  if (element && element.$el instanceof HTMLElement) {
    return element.$el;
  }
  return null;
}

type JSVNode = VNode | JSX.Element | undefined

type VueNode<T> = JSVNode | ((value: T) => JSVNode);

export const renderCondition = <T>(test: T, node: VueNode<T>, elseNode?: VueNode<T>) => {
  if (!!test) {
    return typeof node === 'function' ? node(test) : node;
  } else {
    return typeof elseNode === 'function' ? elseNode(test) : elseNode;
  }
};

export const isEqual = <T = any>(value1: T | T[], value2: T | T[]) => {
  const isArray1 = Array.isArray(value1);
  const isArray2 = Array.isArray(value2);
  if (isArray1 && isArray2) {
    const array1 = value1 as any[];
    const array2 = value2 as any[];
    if (array1.length === array2.length) {
      return array1.every((value, index) => array2[index] === value);
    } else {
      return false;
    }
  } else if (!isArray1 && !isArray2) {
    return value1 === value2;
  } else {
    return false;
  }
};

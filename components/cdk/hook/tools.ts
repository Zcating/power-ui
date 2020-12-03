import {
  InjectionKey,
  Ref,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
} from 'vue';

/**
 * *handle typescript type by function
 * get a token from a function
 *
 * @export
 * @template T
 * @param {(...args: any[]) => T} func
 * @param {string} [name]
 * @returns {InjectionKey<T>}
 */
export function getFuncToken<T>(
  func: (...args: any[]) => T,
  name?: string
): InjectionKey<T> {
  if (name) {
    return name as any;
  }
  return Symbol();
}

/**
 * *handle typescript type by function
 * get a token from class
 *
 * @export
 * @template T
 * @param {{ new (...args: any[]): T }} constructor
 * @param {string} [name]
 * @returns {InjectionKey<T>}
 */
export function getClassToken<T>(
  constructor: { new(...args: any[]): T },
  name?: string
): InjectionKey<T> {
  if (name) {
    return name as any;
  }
  return Symbol();
}

/**
 * run a function while resize
 *
 * @export
 * @param {() => void} func
 * @returns
 */
export function runWhileResize(func: () => void) {
  if (!(typeof document === 'object' && !!document)) return;
  onMounted(() => {
    window.addEventListener('resize', func);
    window.addEventListener('orientationchange', func);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', func);
    window.removeEventListener('orientationchange', func);
  });
}

/**
 * run while scroll
 *
 * @export
 * @param {() => void} func
 * @returns
 */
export function runWhileScroll(func: () => void) {
  if (!(typeof document === 'object' && !!document)) return;
  onMounted(() => {
    window.addEventListener('scroll', func, true);
    window.addEventListener('mousewheel', func);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', func, true);
  });
}

/**
 * get rect of element
 *
 * @export
 * @param {Ref<Element>} elRef
 * @returns
 */
export function getRefRect(elRef: Ref<Element | null | undefined>) {
  const defaultValue = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 0,
    width: 0,
  };
  const rect = ref(defaultValue as DOMRect);
  const getRect = () => {
    const el = unref(elRef);
    if (!(el instanceof Element)) {
      return;
    }
    rect.value = el.getBoundingClientRect();
  };
  runWhileResize(getRect);
  runWhileScroll(getRect);
  onMounted(() => {
    getRect();
  });
  return rect;
}

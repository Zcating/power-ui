import { ResizeObserver, ResizeObserverEntry } from '@juggle/resize-observer';
import {
  isRef,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  Ref,
  shallowRef,
} from 'vue';

/**
 * run a function while resize
 *
 * @export
 * @param {() => void} func
 * @returns
 */
export function useResize(
  dom: Document | HTMLElement | Ref<Document | HTMLElement | null>,
  func: (e: Event) => void
) {
  if (isRef(dom)) {
    onMounted(() => {
      if (!dom.value) {
        return;
      }
      dom.value.addEventListener('resize', func);
      dom.value.addEventListener('orientationchange', func);
    });
    onBeforeUnmount(() => {
      if (!dom.value) {
        return;
      }
      dom.value.removeEventListener('resize', func);
      dom.value.removeEventListener('orientationchange', func);
    });
  } else {
    onMounted(() => {
      dom.addEventListener('resize', func);
      dom.addEventListener('orientationchange', func);
    });
    onBeforeUnmount(() => {
      dom.removeEventListener('resize', func);
      dom.removeEventListener('orientationchange', func);
    });
  }
}

export const useBoxResize = <T>(
  doms: Ref<HTMLElement | null>,
  initValue: T,
  callback: (entry: ResizeObserverEntry) => T
) => {
  const returnRef = shallowRef<T>(initValue);

  const observer = new ResizeObserver((values) => {
    returnRef.value = callback(values[0]);
  });

  onMounted(() => {
    const dom = doms.value;
    if (!dom) {
      return;
    }
    observer.observe(dom);

    onUnmounted(() => {
      observer.unobserve(dom);
    });
  });

  return returnRef;
};

/**
 * run while scroll
 *
 * @export
 * @param {() => void} func
 * @returns
 */
export function useScroll(dom: Document | HTMLElement, func: () => void) {
  onMounted(() => {
    dom.addEventListener('scroll', func, true);
    dom.addEventListener('mousewheel', func);
  });

  onBeforeUnmount(() => {
    dom.removeEventListener('scroll', func, true);
  });
}

export function useAnimationFrame(this: void, func: () => boolean) {
  const rAF = requestAnimationFrame || ((func) => setTimeout(func, 16));
  const cancelAF = cancelAnimationFrame || ((id: number) => clearTimeout(id));

  let id = 0;
  const requstFunc = () => {
    if (func()) {
      cancelAF(id);
      id = rAF(requstFunc);
    } else {
      cancelAF(id);
    }
  };
  id = rAF(requstFunc);
}

export function useTimeout(this: void, func: () => void, duration: number) {
  const id = setTimeout(func, duration);
  return () => clearTimeout(id);
}

export function useInterval(this: void, func: (duration?: number) => void, duration: number) {
  const id = setInterval(func, duration);
  return () => clearInterval(id);
}

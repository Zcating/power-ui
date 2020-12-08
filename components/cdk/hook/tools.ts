import {
  isRef,
  onBeforeUnmount,
  onMounted,
  Ref,
} from 'vue';
import { usePlatform } from 'vue-cdk/global';
import { noop } from 'vue-cdk/types';

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
  const { TOP } = usePlatform();
  if (!TOP) {
    return;
  }
  const rAF = TOP.requestAnimationFrame || ((func) => TOP.setTimeout(func, 16));
  const cancelAF = TOP.cancelAnimationFrame || ((id: number) => TOP.clearTimeout(id));

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
  const { TOP } = usePlatform();
  if (!TOP) {
    return noop;
  }
  const id = TOP.setTimeout(func, duration);
  return () => TOP.clearTimeout(id);
}

export function useInterval(this: void, func: (duration?: number) => void, duration: number) {
  const { TOP } = usePlatform();
  if (!TOP) {
    return noop;
  }
  const id = TOP.setInterval(func, duration);
  return () => TOP.clearInterval(id);
}

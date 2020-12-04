import {
  onBeforeUnmount,
  onMounted,
  onUnmounted,
} from 'vue';
import { usePlatform } from 'vue-cdk/global';

/**
 * run a function while resize
 *
 * @export
 * @param {() => void} func
 * @returns
 */
export function useResize(DOCUMENT: Document, func: () => void) {
  onMounted(() => {
    DOCUMENT.addEventListener('resize', func);
    DOCUMENT.addEventListener('orientationchange', func);
  });
  onBeforeUnmount(() => {
    DOCUMENT.removeEventListener('resize', func);
    DOCUMENT.removeEventListener('orientationchange', func);
  });
}

/**
 * run while scroll
 *
 * @export
 * @param {() => void} func
 * @returns
 */
export function useScroll(func: () => void) {
  const { DOCUMENT } = usePlatform();
  if (!DOCUMENT) {
    return;
  }

  onMounted(() => {
    DOCUMENT.addEventListener('scroll', func, true);
    DOCUMENT.addEventListener('mousewheel', func);
  });

  onBeforeUnmount(() => {
    DOCUMENT.removeEventListener('scroll', func, true);
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
    return;
  }
  const id = TOP.setTimeout(func, duration);
  return () => TOP.clearTimeout(id);
}

export function useInterval(this: void, func: (duration: number) => void, duration: number) {
  const { TOP } = usePlatform();
  if (!TOP) {
    return;
  }
  const id = TOP.setInterval(func, duration);
  return () => TOP.clearInterval(id);
}

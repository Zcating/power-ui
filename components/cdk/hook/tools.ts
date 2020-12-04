import {
  onBeforeUnmount,
  onMounted,
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
  const DOCUMENT = usePlatform().TOP?.document;
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

import { shallowRef, UnwrapRef, watch } from 'vue';
import { useResize } from '../hook/tools';
import { Platform } from '../platform';

/**
 * current viewport rect & size
 *
 * @export
 * @class ViewPort
 */
export class ViewPort {
  size = shallowRef({ width: 0, height: 0 });
  rect = shallowRef({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 });

  /**
   * update viewport size
   *
   * @memberof ViewPort
   */
  updateSize = () => {
    const { TOP } = this.platform;
    this.size.value = TOP
      ? { width: TOP.innerWidth, height: TOP.innerHeight }
      : { width: 0, height: 0 };
  };

  constructor(private platform: Platform) { }

  observe(hook?: (data: UnwrapRef<ViewPort['rect']>) => void) {
    const { DOCUMENT } = this.platform;
    if (!DOCUMENT) {
      return;
    }
    useResize(DOCUMENT, this.updateSize);

    const body = DOCUMENT.documentElement || DOCUMENT.body;

    watch(
      this.size,
      (res) => {
        const rect = body.getBoundingClientRect();
        const top = -rect.top || body.scrollTop || window.scrollY;
        const left = -rect.left || body.scrollLeft || window.scrollX;
        const { width, height } = res;
        this.rect.value = {
          top,
          left,
          bottom: top + height,
          right: left + width,
          width,
          height,
        };
        hook?.(this.rect.value);
      },
      { immediate: true }
    );
  }
}

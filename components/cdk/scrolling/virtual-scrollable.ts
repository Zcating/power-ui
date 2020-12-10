import { inject, InjectionKey, onMounted, provide, Ref, ref, shallowRef } from 'vue';
import { noop } from 'vue-cdk/types';
import { Scrollable } from './scrollable';


const token = Symbol() as InjectionKey<VirtualScrollable>;
export const useVirtualScroll = <T>() => inject(token, null) as VirtualScrollable<T>;

export class VirtualScrollable<T = any> {
  private displayItemsRef: Ref<T[]> = shallowRef([]);
  defaultHeight = 100;
  beforeHeight = 0;
  totalHeight = 0;

  get dispalyItems() {
    return this.displayItemsRef.value;
  }

  /**
   * scrollable container
   *
   */
  containerRef = ref<HTMLElement | null>(null);
  scrollable: Scrollable;

  /**
   * scroll listener
   *
   */
  handleChange = () => {
    // no container, no handler
    const container = this.containerRef.value;
    if (!container) {
      return;
    }
    const { defaultHeight, items, activeTags, itemHeight } = this;
    const { scrollTop, clientHeight: containerHeight } = container;
    const buffer = 2 * defaultHeight;
    let beforeHeight = 0;
    let contentHeight = 0;
    let afterHeight = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const height = itemHeight?.(item) ?? defaultHeight;
      if (beforeHeight < scrollTop - buffer) {
        beforeHeight += height;
        activeTags[i] = 0;
      } else if (contentHeight < containerHeight + 3 * buffer) {
        contentHeight += height;
        activeTags[i] = 1;
      } else {
        afterHeight += height;
        activeTags[i] = 0;
      }
    }

    this.beforeHeight = beforeHeight;
    this.totalHeight = beforeHeight + afterHeight + contentHeight;
    this.displayItemsRef.value = items.filter((_, index) => this.activeTags[index] === 1);
  };

  private activeTags: Int8Array;
  constructor(
    private readonly items: T[] = [],
    private readonly itemHeight: (this: void, data: T) => number = noop,
  ) {
    this.activeTags = new Int8Array(items.length);

    // bind scrollable
    this.scrollable = new Scrollable(this.containerRef, this.handleChange);

    onMounted(() => {
      this.handleChange();
    });

    provide(token, this);
  }

  /**
   * scroll to certain position
   *
   * @param {ScrollToOptions} opt
   */
  scrollTo(opt: ScrollToOptions) {
    this.scrollable.scrollTo(opt);
  }
}

import { inject, InjectionKey, onMounted, provide, Ref, ref, shallowRef } from 'vue';
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
  scrollTop = 0;

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
    this.scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const buffer = 2 * this.defaultHeight;
    let beforeHeight = 0;
    let contentHeight = 0;
    let afterHeight = 0;
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const height = this.itemHeight?.(item) ?? this.defaultHeight;
      if (beforeHeight < this.scrollTop - buffer) {
        beforeHeight += height;
        this.activeTags[i] = 0;
      } else if (contentHeight < containerHeight + 3 * buffer) {
        contentHeight += height;
        this.activeTags[i] = 1;
      } else {
        afterHeight += height;
        this.activeTags[i] = 0;
      }
    }
    this.beforeHeight = beforeHeight;
    this.totalHeight = beforeHeight + afterHeight + contentHeight;
    this.displayItemsRef.value = this.items.filter((_, index) => this.activeTags[index] === 1);
  };

  private activeTags: Int8Array;
  constructor(
    private items: T[],
    private itemHeight?: (this: void, data: T) => number,
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

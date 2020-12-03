import { inject, InjectionKey, onMounted, provide, Ref, ref, shallowRef } from 'vue';
import Scrollable from './scrollable';
import { throttle } from 'lodash-es';
interface ItemData {
  [key: string]: any;
  _active?: boolean;
  _itemHeight?: number;
  _defaultHeight?: number;
}

const token = Symbol() as InjectionKey<VirtualScrollable>;
export const useVirtualScroll = () => inject(token, null);

export class VirtualScrollable {
  displayItemsRef: Ref<ItemData[]> = shallowRef([]);

  get dispalyItems() {
    return this.displayItemsRef.value;
  }

  private items: ItemData[] = [];
  defaultHeight = 100;
  beforeHeight = 0;
  totalHeight = 0;

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
  handleChange = throttle(() => {
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
    for (const item of this.items) {
      const height = item._itemHeight || this.defaultHeight;
      if (beforeHeight < this.scrollTop - buffer) {
        beforeHeight += height;
        item._active = false;
      } else if (contentHeight < containerHeight + 3 * buffer) {
        contentHeight += height;
        item._active = true;
        item._defaultHeight = this.defaultHeight;
      } else {
        afterHeight += height;
        item._active = false;
      }
    }
    this.beforeHeight = beforeHeight;
    this.totalHeight = beforeHeight + afterHeight + contentHeight;
    this.displayItemsRef.value = this.items.filter((el) => el._active);
  }, 300);


  constructor(items: ItemData[]) {
    // target data
    this.items = items;
    // bind scrollable
    this.scrollable = new Scrollable();
    this.scrollable.nodeRef = this.containerRef;
    this.scrollable.scrollCb = this.handleChange;
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

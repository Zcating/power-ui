import { onMounted, provide, Ref, ref } from "vue";
import { markDirty } from "../tools";
import Scrollable from "./scrollable";

interface ItemData {
  [key: string]: any;
  _active?: boolean;
  _itemHeight?: number;
  _defaultHeight?: number;
}

export default class {
  items: ItemData[] = [];
  displayItems: ItemData[] = [];
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

  mark: () => void;
  dirty: Ref<any>;

  /**
   * scroll listener
   *
   */
  handleChange = () => {
    // no container, no handler
    if (!this.containerRef.value) return;
    this.scrollTop = this.containerRef.value.scrollTop;
    const containerHeight = this.containerRef.value.clientHeight;
    const buffer = 3 * this.defaultHeight;
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
    this.displayItems = this.items.filter((el) => el._active);
    this.mark();
  };

  constructor(items: ItemData[]) {
    // reactivity
    const { dirty, mark } = markDirty();
    this.dirty = dirty;
    this.mark = mark;
    // target data
    this.items = items;
    // bind scrollable
    this.scrollable = new Scrollable();
    this.scrollable.nodeRef = this.containerRef;
    this.scrollable.scrollCb = this.handleChange;
    onMounted(() => {
      this.handleChange();
    });
    provide("cdk-virtual-scroll", this);
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

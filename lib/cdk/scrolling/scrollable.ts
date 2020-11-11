import { inject, onBeforeMount, onMounted, Ref, ref } from "vue";
import { platformToken } from "../global";
import { noop } from '../types';

/**
 * scroll anchor direction
 *
 * @export
 * @enum {number}
 */
export enum ScrollFrom {
  top = "top",
  left = "left",
  right = "right",
  bottom = "bottom",
  start = "start",
  end = "end",
}

/**
 * prossible scroll type of browser
 *
 * @export
 * @enum {number}
 */
export enum ScrollAxisType {
  normal = "normal",
  negated = "negated",
  inverted = "inverted",
}

/**
 *scroll to command
 *
 * @export
 * @interface ScrollToOptions
 */
export interface ScrollToOptions {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  start?: number;
  end?: number;
}

export default class {
  nodeRef = ref<HTMLElement | null>(null);
  scrollCb: (e: Event) => void = noop;
  private body = inject(platformToken)!.BODY;
  private scrollAxisType?: ScrollAxisType;
  private handleScroll = (e: Event) => {
    this.scrollCb(e);
  };
  constructor() {
    onMounted(() => {
      if (this.nodeRef.value)
        this.nodeRef.value.addEventListener("scroll", this.handleScroll);
    });
    onBeforeMount(() => {
      if (this.nodeRef.value)
        this.nodeRef.value.removeEventListener("scroll", this.handleScroll);
    });
  }

  /**
   * scroll to specific target
   * !never forget relative position of scrollable ref
   * !never forget param nodeRef is direct child of scrollable ref
   *
   */
  scrollToElement = (nodeRef: Ref<HTMLElement | null>) => {
    if (!nodeRef.value) return;
    const el = nodeRef.value;
    this.scrollTo({ top: el.offsetTop, left: el.offsetLeft });
  };

  /**
   * pre handle scroll to options
   *
   */
  scrollTo = (options: ScrollToOptions) => {
    if (!this.nodeRef.value) return;
    const el = this.nodeRef.value;
    const isRtl = this.body?.dir && this.body?.dir === "rtl";
    if (options.left === undefined) {
      options.left = isRtl ? options.end : options.start;
    }
    if (options.right === undefined) {
      options.right = isRtl ? options.start : options.end;
    }
    if (options.bottom !== undefined) {
      options.top = el.scrollHeight - el.clientHeight - options.bottom;
    }
    if (isRtl && this.getScrollAxisType() !== ScrollAxisType.normal) {
      if (options.left !== undefined) {
        options.right = el.scrollWidth - el.clientWidth - options.left;
      }

      if (this.getScrollAxisType() === ScrollAxisType.inverted) {
        options.left = options.right;
      } else if (this.getScrollAxisType() === ScrollAxisType.negated) {
        options.left = options.right ? -options.right : options.right;
      }
    } else {
      if (options.right !== undefined) {
        options.left = el.scrollWidth - el.clientWidth - options.right;
      }
    }
    this.applyScrollToOptions(options);
  };

  /**
   * handle scrollto
   *
   */
  applyScrollToOptions = (options: ScrollToOptions) => {
    if (!this.nodeRef.value) return;
    const el = this.nodeRef.value;
    if (options.top !== undefined) {
      el.scrollTop = options.top;
    }
    if (options.left !== undefined) {
      el.scrollLeft = options.left;
    }
  };

  /**
   * mesure offset from an anchor
   *
   */
  mesureScrollOffset = (from: ScrollFrom) => {
    if (!this.nodeRef.value) return 0;
    const el = this.nodeRef.value;
    if (from === ScrollFrom.top) return el.scrollTop;
    if (from === ScrollFrom.bottom)
      return el.scrollHeight - el.clientHeight - el.scrollTop;
    // switch from left/right while rtl
    const isRtl = this.body?.dir && this.body?.dir === "rtl";
    if (from === ScrollFrom.start) {
      from = isRtl ? ScrollFrom.right : ScrollFrom.left;
    } else if (from === ScrollFrom.end) {
      from = isRtl ? ScrollFrom.left : ScrollFrom.right;
    }
    // handle rtl with scroll axis type
    if (isRtl && this.getScrollAxisType() === ScrollAxisType.inverted) {
      if (from === ScrollFrom.left) {
        return el.scrollWidth - el.clientWidth - el.scrollLeft;
      } else {
        return el.scrollLeft;
      }
    } else if (isRtl && this.getScrollAxisType() === ScrollAxisType.negated) {
      if (from === ScrollFrom.left) {
        return el.scrollLeft + el.scrollWidth - el.clientWidth;
      } else {
      }
      return -el.scrollLeft;
    } else {
      if (from === ScrollFrom.left) {
        return el.scrollLeft;
      } else {
        return el.scrollWidth - el.clientWidth - el.scrollLeft;
      }
    }
  };

  /**
   * get the browser scroll type by dom
   *
   */
  getScrollAxisType = (): ScrollAxisType => {
    if (!this.body) {
      this.scrollAxisType = ScrollAxisType.normal;
      return this.scrollAxisType;
    }
    if (this.scrollAxisType === undefined) {
      const container = document.createElement("div");
      container.dir = "rtl";
      container.style.width = "1px";
      container.style.overflow = "auto";
      container.style.visibility = "hidden";
      container.style.pointerEvents = "none";
      container.style.position = "absolute";
      const content = document.createElement("div");
      content.style.width = "2px";
      content.style.height = "1px";
      container.appendChild(content);
      document.body.append(container);
      this.scrollAxisType = ScrollAxisType.normal;
      if (container.scrollLeft === 0) {
        container.scrollLeft = 1;
        this.scrollAxisType =
          container.scrollLeft === 0
            ? ScrollAxisType.negated
            : ScrollAxisType.inverted;
      }
      container.parentNode?.removeChild(container);
    }
    return this.scrollAxisType;
  };
}

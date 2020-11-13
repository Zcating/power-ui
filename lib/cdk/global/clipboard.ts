import { inject, ref } from "vue";
import { platformToken } from ".";
import Platform from './platform';

class Copy {
  textarea: HTMLTextAreaElement | undefined;
  constructor(text: string) {
    this.textarea = document.createElement("textarea");
    this.textarea.style.position = "fixed";
    this.textarea.style.top = "0";
    this.textarea.style.left = "-10000em";
    this.textarea.setAttribute("area-hidden", "true");
    this.textarea.value = text;
    document.body.appendChild(this.textarea);
  }

  /**
   * get the copy content
   *
   * @returns
   * @memberof Copy
   */
  copy() {
    let success = false;
    // discard none textarea
    if (!this.textarea) return;
    try {
      const focus: HTMLOrSVGElement | null = document.activeElement as any;
      this.textarea.select();
      this.textarea.setSelectionRange(0, this.textarea.value.length);
      success = document.execCommand("copy");
      if (focus) focus.focus();
    } catch {
      // discard error
    }
    return success;
  }

  /**
   * remove text node
   * remove side effect
   *
   * @memberof Copy
   */
  destroy() {
    if (this.textarea && this.textarea.parentNode) {
      this.textarea.parentNode.removeChild(this.textarea);
    } else {
      this.textarea = undefined;
    }
  }
}

/**
 * clip now
 *
 * @export
 * @class Clipboard
 */
export default class Clipboard {
  private doc: Document | undefined;
  nodeRef = ref<HTMLElement | null>(null);
  constructor(platform: Platform) {
    if (!platform.BROWSER) return;
    this.doc = document;
  }

  /**
   * copy text
   *
   * @param {string} text
   * @returns
   * @memberof Clipboard
   */
  copy(text: string) {
    // no doc no functionaility
    if (!this.doc) return "";
    const copyEl = new Copy(text);
    console.log(copyEl);
    const result = copyEl.copy();
    copyEl.destroy();
    return result;
  }
}

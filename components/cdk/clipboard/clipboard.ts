import { Platform } from '../platform';

class Copy {
  textarea: HTMLTextAreaElement | undefined;
  constructor(text: string, DOCUMENT: Document) {

    this.textarea = DOCUMENT.createElement('textarea');
    this.textarea.style.position = 'fixed';
    this.textarea.style.top = '0';
    this.textarea.style.left = '-10000em';
    this.textarea.setAttribute('area-hidden', 'true');
    this.textarea.value = text;
    DOCUMENT.body.appendChild(this.textarea);
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
      success = document.execCommand('copy');
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
export class CdkClipboard {
  private doc: Document | undefined;

  constructor(platform?: Platform) {
    if (!platform?.DOCUMENT) {
      return;
    }
    this.doc = platform?.DOCUMENT ?? document;
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
    if (!this.doc) {
      return '';
    }
    const copyEl = new Copy(text, this.doc);
    const result = copyEl.copy();
    copyEl.destroy();
    return result;
  }
}

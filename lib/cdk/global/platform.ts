let hasV8BreakIterator: boolean;

try {
  hasV8BreakIterator =
    typeof Intl !== "undefined" && (Intl as any).v8BreakIterator;
} catch (e) {
  hasV8BreakIterator = false;
}

export default class Platform {
  /**
   * checkout if this is in browser envir
   *
   * @memberof Platform
   */
  readonly BROWSER = typeof document === "object" && !!document;

  /**
   * the body element, when browser active
   * all body api shoud be use by this
   *
   * @memberof Platform
   */
  readonly BODY = this.BROWSER
    ? document.documentElement || document.body || null
    : null;

  readonly TOP = this.BROWSER ? window : null;

  readonly EDGE: boolean = this.BROWSER && /(edge)/i.test(navigator.userAgent);

  readonly TRIDENT: boolean =
    this.BROWSER && /(msie|trident)/i.test(navigator.userAgent);

  readonly BLINK: boolean =
    this.BROWSER &&
    !!((this.TOP as any).chrome || hasV8BreakIterator) &&
    typeof CSS !== "undefined" &&
    !this.EDGE &&
    !this.TRIDENT;

  readonly WEBKIT: boolean =
    this.BROWSER &&
    /AppleWebKit/i.test(navigator.userAgent) &&
    !this.BLINK &&
    !this.EDGE &&
    !this.TRIDENT;

  readonly IOS: boolean =
    this.BROWSER &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !("MSStream" in (this.TOP as any));

  readonly FIREFOX: boolean =
    this.BROWSER && /firefox|minefield/i.test(navigator.userAgent);

  readonly ANDROID: boolean =
    this.BROWSER && /android/i.test(navigator.userAgent) && !this.TRIDENT;

  readonly SAFARI: boolean =
    this.BROWSER && /safari/i.test(navigator.userAgent) && this.WEBKIT;
}

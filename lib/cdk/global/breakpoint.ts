import { inject, onBeforeUnmount, ref } from "vue";
import { platformToken } from ".";

const breakPoints = {
  xs: "(max-width: 599.99px)",
  s: "(min-width: 600px) and (max-width: 959.99px)",
  m: "(min-width: 960px) and (max-width: 1279.99px)",
  l: "(min-width: 1280px) and (max-width: 1919.99px)",
  xl: "(min-width: 1920px)",
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
};

/**
 * detect sizing status
 *
 * @export
 * @class
 */
export default class {
  span = ref<"xs" | "s" | "m" | "l" | "xl">("m");
  direction = ref<"portrait" | "landscape">("landscape");
  queryMedia = (top: any, query: string, cb: (val: boolean) => void) => {
    // get media list
    let mql: MediaQueryList | null = null;
    const handler = (e: any) => {
      cb(e.matches);
    };
    mql = top?.matchMedia?.(query);
    if (!mql) return;
    cb(mql.matches);
    mql.addEventListener("change", handler);
    onBeforeUnmount(() => {
      if (mql) {
        mql.removeEventListener("change", handler);
      }
    });
  };

  constructor() {
    if (!inject(platformToken)!.BROWSER) return;
    const { TOP } = inject(platformToken)!;
    for (const key in breakPoints) {
      this.queryMedia(TOP, (breakPoints as any)[key], (e) => {
        if (e) {
          switch (key) {
            case "xs":
            case "s":
            case "m":
            case "l":
            case "xl":
              this.span.value = key;
              break;
            case "portrait":
            case "landscape":
              this.direction.value = key;
              break;
          }
        }
      });
    }
  }
}

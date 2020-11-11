import {
  computed,
  ComputedRef,
  inject,
  InjectionKey,
  provide,
  Ref,
  ref,
  watch,
} from "vue";
import { setGlobalDateI18n, Days, Months } from "fecha";
import { getClassToken } from "../tools";
import Breakpoint from "./breakpoint";
import Bidirection from "./bidirection";
import Platform from "./platform";
import Clipboard from "./clipboard";
import ViewPort from "./viewport";
import * as lang from "../lang";
// provide token
export const platformToken = Symbol('cdk-platform') as  InjectionKey<Platform>;
export const breakpointToken = getClassToken(Breakpoint);
export const bidirectionToken = getClassToken(Bidirection);
export const clipboardToken = getClassToken(Clipboard);
export const viewportToken = getClassToken(ViewPort);
export const langToken: InjectionKey<ComputedRef<
  lang.LangConfig
>> = "cdk-lang" as any;
export const setLangToken: InjectionKey<Ref<string>> = "cdk-lang-setter" as any;

/**
 * all the global apis will only have single instace
 * *use in this formation
 * * const xxx = inject(xxxToken)!
 * singleton for performance
 *
 * @export
 */
export default function () {
  provide(platformToken, new Platform());
  // ! order should be manage carefully
  // ! platform first
  provide(breakpointToken, new Breakpoint());
  provide(bidirectionToken, new Bidirection());
  provide(clipboardToken, new Clipboard());
  provide(viewportToken, new ViewPort());

  // add overlay anchor
  const platform = inject(platformToken)!;
  if (platform.BROWSER) {
    // if at browser environment
    const overlayAnchor = document.createElement("div");
    overlayAnchor.setAttribute("id", "cdk-overlay-anchor");
    overlayAnchor.style.position = "fixed";
    overlayAnchor.style.left = "0";
    overlayAnchor.style.top = "0";
    platform.BODY!.appendChild(overlayAnchor);
  }

  // add language provider
  const langValue = ref("zhCN");
  const cdkLang: ComputedRef<lang.LangConfig> = computed(() => {
    if (langValue.value === "index") {
      return lang.zhCN;
    }
    return (lang as any)[langValue.value] || lang.zhCN;
  });
  watch(
    cdkLang,
    (res) => {
      // get week name ignore shor/long
      const weeks = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map(
        (el) => (res.datepicker.weeks as any)[el]
      ) as Days;
      const months = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ].map((el) => (res.datepicker.months as any)[el]) as Months;
      const shortMonths = new Array(12).map(
        (_, index) => (res.datepicker as any)["month" + (index + 1)]
      ) as Months;
      setGlobalDateI18n({
        dayNamesShort: weeks,
        dayNames: weeks,
        monthNamesShort: shortMonths,
        monthNames: months,
        amPm: ["am", "pm"],
      });
    },
    { immediate: true }
  );
  provide(langToken, cdkLang);
  provide(setLangToken, langValue);
}

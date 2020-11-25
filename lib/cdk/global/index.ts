import {
  ComputedRef,
  InjectionKey,
  Ref,
  computed,
  provide,
  ref,
  watch,
  inject,
} from 'vue';
import { Days, Months, setGlobalDateI18n } from 'fecha';
import { getClassToken } from '../tools';
import Breakpoint from './breakpoint';
import Bidirection from './bidirection';
import Platform from './platform';
import Clipboard from './clipboard';
import ViewPort from './viewport';
import * as lang from '../lang';
// provide token
const platformToken = getClassToken(Platform);
const breakpointToken = getClassToken(Breakpoint);
const bidirectionToken = getClassToken(Bidirection);
const clipboardToken = getClassToken(Clipboard);
const viewportToken = getClassToken(ViewPort);

export const usePlatform = () => inject(platformToken)!;
export const useBreakpoint = () => inject(breakpointToken)!;
export const useBidirection = () => inject(bidirectionToken)!;
export const useClipboard = () => inject(clipboardToken)!;
export const useViewport = () => inject(viewportToken)!;

export const langToken: InjectionKey<ComputedRef<
  lang.LangConfig
>> = 'cdk-lang' as any;
export const setLangToken: InjectionKey<Ref<string>> = 'cdk-lang-setter' as any;

/**
 * all the global apis will only have single instace
 * *use in this formation
 * * const xxx = inject(xxxToken)!
 * singleton for performance
 *
 * @export
 */
export function globalInject() {
  const platform = new Platform();
  provide(platformToken, new Platform());
  // ! order should be manage carefully
  // ! platform first
  provide(breakpointToken, new Breakpoint(platform));
  provide(bidirectionToken, new Bidirection(platform));
  provide(clipboardToken, new Clipboard(platform));
  provide(viewportToken, new ViewPort(platform));

  // add overlay anchor
  if (platform.BROWSER) {
    // if at browser environment
    const overlayAnchor = document.createElement('div');
    overlayAnchor.setAttribute('id', 'cdk-overlay-anchor');
    overlayAnchor.style.position = 'fixed';
    overlayAnchor.style.left = '0';
    overlayAnchor.style.top = '0';
    overlayAnchor.style.zIndex = '1000';
    platform.BODY!.appendChild(overlayAnchor);
  }

  // add language provider
  const langValue = ref('zhCN');
  const cdkLang: ComputedRef<lang.LangConfig> = computed(() => {
    if (langValue.value === 'index') {
      return lang.zhCN;
    }
    return (lang as any)[langValue.value] || lang.zhCN;
  });
  watch(
    cdkLang,
    (res) => {
      // get week name ignore shor/long
      const weeks = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(
        (el) => (res.datepicker.weeks as any)[el]
      ) as Days;
      const months = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
      ].map((el) => (res.datepicker.months as any)[el]) as Months;
      const shortMonths = new Array(12).map(
        (_, index) => (res.datepicker as any)['month' + (index + 1)]
      ) as Months;
      setGlobalDateI18n({
        dayNamesShort: weeks,
        dayNames: weeks,
        monthNamesShort: shortMonths,
        monthNames: months,
        amPm: ['am', 'pm'],
      });
    },
    { immediate: true }
  );
  provide(langToken, cdkLang);
  provide(setLangToken, langValue);
}

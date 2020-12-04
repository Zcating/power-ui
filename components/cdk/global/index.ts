import {
  provide,
  inject,
  InjectionKey,
} from 'vue';
import Breakpoint from './breakpoint';
import Bidirection from './bidirection';
import Platform from './platform';
import Clipboard from './clipboard';
import ViewPort from './viewport';


// provide token
const platformToken = Symbol() as InjectionKey<Platform>;
const breakpointToken = Symbol() as InjectionKey<Breakpoint>;
const bidirectionToken = Symbol() as InjectionKey<Bidirection>;
const clipboardToken = Symbol() as InjectionKey<Clipboard>;
const viewportToken = Symbol() as InjectionKey<ViewPort>;

export const usePlatform = () => inject(platformToken)!;
export const useBreakpoint = () => inject(breakpointToken)!;
export const useBidirection = () => inject(bidirectionToken)!;
export const useClipboard = () => inject(clipboardToken)!;
export const useViewport = () => inject(viewportToken)!;

// export const langToken: InjectionKey<ComputedRef<lang.LangConfig>> = 'cdk-lang' as any;
// export const setLangToken: InjectionKey<Ref<string>> = 'cdk-lang-setter' as any;

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
  if (platform.DOCUMENT && platform.BODY) {
    // if at browser environment
    const overlayAnchor = platform.DOCUMENT.createElement('div');
    overlayAnchor.setAttribute('id', 'cdk-overlay-anchor');
    overlayAnchor.style.position = 'fixed';
    overlayAnchor.style.left = '0';
    overlayAnchor.style.top = '0';
    overlayAnchor.style.zIndex = '1000';
    platform.BODY.appendChild(overlayAnchor);
  }
}

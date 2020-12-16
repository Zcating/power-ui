import { App, InjectionKey, Plugin } from 'vue';
import { Platform } from 'vue-cdk/platform';
import { Breakpoint } from './breakpoint';
import { useInjection, providePlugin } from '../core';

export { Breakpoint } from './breakpoint';

const token = Symbol() as InjectionKey<Breakpoint>;
export const useBreakpoint = () => useInjection(token);
export const cdkBreakpoint: Plugin = {
  install(app: App, platform: Platform, noMixin: boolean) {
    providePlugin(app, {
      name: !noMixin ? 'breakpoint' : '',
      token,
      target: new Breakpoint(platform)
    });
  }
};

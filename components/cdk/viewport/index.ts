import { InjectionKey, App, Plugin } from 'vue';
import { useInjection, providePlugin } from '../core';
import { Platform } from '../platform';
import { ViewPort } from './viewport';

export { ViewPort } from './viewport';

const token = Symbol() as InjectionKey<ViewPort>;
export const useViewport = () => useInjection(token);
export const cdkViewport: Plugin = {
  install(app: App, platform: Platform, noMixin: boolean) {
    providePlugin(app, {
      name: !noMixin ? '$viewport' : '',
      token,
      target: new ViewPort(platform)
    });
  }
};
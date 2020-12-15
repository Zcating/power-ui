import { App, InjectionKey, Plugin } from 'vue';
import { Platform } from 'vue-cdk/platform';
import { Clipboard } from './clipboard';
import { useInjection, providePlugin } from '../core';

export { Clipboard } from './clipboard';

const token = Symbol() as InjectionKey<Clipboard>;
export const useClipboard = () => useInjection(token);
export const cdkClipboard: Plugin = {
  install(app: App, platform: Platform, noMixin: boolean) {
    providePlugin(app, {
      name: !noMixin ? '$clipboard' : '',
      token,
      target: new Clipboard(platform)
    });
  }
};

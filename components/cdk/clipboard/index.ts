import { App, InjectionKey, Plugin } from 'vue';
import { Platform } from 'vue-cdk/platform';
import { CdkClipboard } from './clipboard';
import { useInjection, providePlugin } from '../core';
import { ClipboardDirective } from './clipboard.directive';

export { CdkClipboard } from './clipboard';

const token = Symbol() as InjectionKey<CdkClipboard>;
export const useClipboard = () => useInjection(token);
export const cdkClipboard: Plugin = {
  install(app: App, platform: Platform, noMixin: boolean) {
    const target = new CdkClipboard(platform);
    providePlugin(app, {
      name: !noMixin ? '$clipboard' : '',
      token,
      target: new CdkClipboard(platform)
    });
    app.directive('cdkClip', ClipboardDirective(target));
  }
};

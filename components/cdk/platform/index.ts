import { App, inject, InjectionKey, Plugin } from 'vue';
import { providePlugin, useInjection } from 'vue-cdk/core';
import { Platform } from './platform';

const platformToken = Symbol() as InjectionKey<Platform>;

export { Platform } from './platform';

export const usePlatform = () => useInjection(platformToken);

export const cdkPlatform: Plugin = {
  install(app: App, platform: Platform = new Platform()) {
    providePlugin(app, {
      token: platformToken as symbol,
      name: 'platform',
      target: platform
    });
  }
};

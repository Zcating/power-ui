import { App, inject, InjectionKey, Plugin } from 'vue';
import { Platform } from './platform';

const platformToken = Symbol() as InjectionKey<Platform>;

export { Platform } from './platform';

export const usePlatform = () => {
  const platform = inject(platformToken, null);
  if (!platform) {
    throw Error('[vue-cdk][platform]: Make sure you add your platform plugin.');
  }
  return platform;
};

export const cdkPlatform: Plugin = {
  install(app: App, platform: Platform = new Platform()) {
    app.provide(platformToken, platform);
    app.mixin({
      inject: {
        $platform: platformToken as symbol,
      }
    });
  }
};

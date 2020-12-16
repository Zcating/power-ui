import { App, InjectionKey, Plugin } from 'vue';
import { Platform } from 'vue-cdk/platform';
import { Bidirection } from './bidirection';
import { useInjection, providePlugin } from '../core';

export { Bidirection } from './bidirection';

const token = Symbol() as InjectionKey<Bidirection>;
export const useBidirection = () => useInjection(token);
export const cdkBidirection: Plugin = {
  install(app: App, platform: Platform, noMixin: boolean) {
    providePlugin(app, {
      name: !noMixin ? 'bidi' : '',
      token,
      target: new Bidirection(platform)
    });
  }
};

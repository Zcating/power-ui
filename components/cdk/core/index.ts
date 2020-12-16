import { App, inject, InjectionKey } from 'vue';

export const useInjection = <T>(key: symbol | InjectionKey<T>): T => {
  const injection = inject(key, null);
  if (!injection) {
    throw Error(`[vue-cdk][${String(key)}]: Make sure you have provided the object`);
  }
  return injection;
};

interface providePluginOptions<T> {
  token: symbol | InjectionKey<T>;
  name: string;
  target: T;
}
// export const 
export const providePlugin = <T>(app: App, options: providePluginOptions<T>) => {
  app.provide(options.token, options.target);
  if (options.name) {
    app.mixin({
      inject: {
        [`$${options.name}`]: options.token as symbol
      }
    });
  }
};
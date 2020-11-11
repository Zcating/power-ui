import { InjectionKey, provide } from 'vue';

/**
 * @description
 * 
 * @date 2020-09-24
 * @export
 * @class AccordionDispatcher
 */
export class AccordionDispatcher {

  static key: InjectionKey<AccordionDispatcher> = Symbol('cdk-accordion-dispatcher');

  readonly subscribers: ((value: boolean) => void)[] = [];

  constructor() {
    provide(AccordionDispatcher.key, this);
  }

  subscribe(next: (value: boolean) => void) {
    this.subscribers.push(next);
  }

  notify(value: boolean) {
    this.subscribers.forEach(fn => fn?.(value))
  }
}

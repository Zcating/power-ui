import { inject, InjectionKey, nextTick, onUnmounted, provide, Ref, toRaw, watch } from 'vue';
import Schema, { RuleItem, ValidateError } from 'async-validator';
import { FormRules } from './types';

const token = Symbol() as InjectionKey<FormSerivce>;

export const useFormService = () => inject(token, null);

export class FormSerivce {
  private readonly pendingState: { [key in string]: any } = {};
  private readonly hookErrors: { [key in string]: (errors?: ValidateError[]) => void } = {};

  constructor(
    private state: Ref<Record<string, any>>,
    private rulesRef: Ref<FormRules>,
  ) {
    this.pendingState = toRaw(state.value);

    provide(token, this);
  }

  async validate() {
    return await (new Schema(this.rulesRef.value)).validate(
      this.state.value,
      {},
      (errors, res) => {
        Object.keys(res).forEach((value) => {
          this.hookErrors[value]?.(res[value]);
        });
      }
    );
  }

  reset(names: string[]) {
    for (const name of names) {
      const paths = name.split('.');

      let state = this.state.value;
      let pendingValue = this.pendingState;
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        if (i === path.length - 1) {
          state[path] = pendingValue[path];
        } else {
          state = state[path];
          pendingValue = pendingValue[path];
        }
      }
      this.hookErrors[name]?.();
    }
  }

  bindErrors(name: string, hook: (errors?: ValidateError[]) => void) {
    this.hookErrors[name] = hook;
  }

  onFieldBlur(el: HTMLElement, name: string, ruleItems?: RuleItem | RuleItem[]) {
    this.onFieldEvent(el, name, ruleItems, 'blur');
  }

  onFieldChange(el: HTMLElement, name: string, ruleItems?: RuleItem | RuleItem[]) {
    this.onFieldEvent(el, name, ruleItems, 'change');
  }

  private validateField(name: string, trigger: 'blur' | 'change') {
    const rules = this.rulesRef.value[name];
    if (Array.isArray(rules)) {
      return rules.filter(value => value.trigger === trigger);
    } else if (rules && rules.trigger === trigger) {
      return rules;
    }
  }

  private onFieldEvent(el: HTMLElement, name: string, ruleItems: RuleItem | RuleItem[] | undefined, trigger: 'change' | 'blur') {
    const rules = this.validateField(name, trigger) ?? ruleItems;
    if (!rules) {
      return;
    }
    const listener = (event: any) => {
      setTimeout(() => {
        const schema = new Schema({ [name]: rules });
        schema.validate(this.state.value, { firstFields: true }, (_, res) => {
          this.hookErrors[name]?.(res?.[name]);
        });
      }, 100);
    };
    el.addEventListener(trigger, listener, true);

    onUnmounted(() => {
      el.removeEventListener(trigger, listener);
    });
  }
}



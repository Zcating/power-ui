import { inject, InjectionKey, provide, Ref, toRaw } from 'vue';
import Schema, { ValidateError } from 'async-validator';
import { FieldRules, FormRules } from './types';

const token = Symbol() as InjectionKey<FormSerivce>;

export const useFormService = () => inject(token, null);

export class FormSerivce {
  private readonly pendingState: { [key in string]: any } = {};
  private readonly hookErrors: { [key in string]: (errors?: string[]) => any } = {};

  constructor(
    private state: Ref<Record<string, any>>,
    public rulesRef: Ref<FormRules>,
  ) {
    this.pendingState = toRaw(state.value);

    provide(token, this);
  }

  async validate() {
    const promises = Object.keys(this.hookErrors).map((key) => this.hookErrors[key]());
    return Promise.all(promises);
  }

  bindValidate(name: string, fieldRules: FieldRules | FieldRules[] | undefined, hook: (result: string[]) => void) {
    this.hookErrors[name] = async () => {
      const rules = [...this.getRuleArray(fieldRules), ...this.getRuleArray(this.rulesRef.value[name])];
      const result = await this.fieldValidate(name, rules);
      hook(result);
    };
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

  validateRules(name: string, rules: FieldRules | FieldRules[] | undefined, trigger: 'blur' | 'change') {
    return [
      ...this.getConditionRules(this.rulesRef.value[name], trigger),
      ...this.getConditionRules(rules, trigger)
    ];
  }

  async fieldValidate(name: string, rules: FieldRules[]) {
    let result: string[] = [];
    try {
      await new Schema({ [name]: rules }).validate({ [name]: this.state.value[name] }, { firstFields: true });
    } catch (e) {
      if (e.errors) {
        result = e.errors.map(({ message }: ValidateError) => message);
      } else {
        console.error(e);
      }
    }
    return result;
  }

  private getConditionRules(rules: FieldRules | FieldRules[] | undefined, trigger: 'blur' | 'change') {
    if (Array.isArray(rules)) {
      return rules.filter(value => value.trigger === trigger);
    } else if (rules && rules.trigger === trigger) {
      return [rules];
    } else {
      return [];
    }
  }

  private getRuleArray(rules: FieldRules | FieldRules[] | undefined) {
    if (Array.isArray(rules)) {
      return rules;
    } else if (rules) {
      return [rules];
    } else {
      return [];
    }
  }
}



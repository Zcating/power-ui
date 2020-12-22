import { inject, InjectionKey, provide, Ref, toRaw } from 'vue';
import Schema, { ValidateError } from 'async-validator';
// cdk
import { MaybeArray } from 'vue-cdk/types';

import { FieldRules, FormRules } from './types';


const token = Symbol() as InjectionKey<FormSerivce>;

export const useFormService = () => inject(token, null);

/**
 * @class FormService
 * 
 * @description 
 * 
 */
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

  /**
   * 
   */
  async validate() {
    const promises = Object.keys(this.hookErrors).map((key) => this.hookErrors[key]());
    return Promise.all(promises);
  }

  /**
   * @function bindValidate
   * 
   * @description 
   * 
   * @param name 
   * @param fieldRules 
   * @param hook 
   */
  bindValidate(name: string, fieldRules: FieldRules | FieldRules[] | undefined, hook: (result: string[]) => void) {
    this.hookErrors[name] = async () => {
      const rules = [...this.getRuleArray(fieldRules), ...this.getRuleArray(this.rulesRef.value[name])];
      const result = await this.fieldValidate(name, rules);
      hook(result);
    };
  }

  /**
   * @function reset 
   * 
   * @description rest the fields by names.
   * 
   * @param names fields to reset

   * @memberof FormService
   */
  reset(names: string[] = []) {
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


  /**
   * @function validateRules
   * 
   * @description validate 
   * 
   * @param name 
   * @param rules 
   * @param trigger 
   * 
   * @memberof FormService
   */
  validateRules(name: string, rules: FieldRules | FieldRules[] | undefined, trigger: 'blur' | 'change') {
    return [
      ...this.getConditionRules(this.rulesRef.value[name], trigger),
      ...this.getConditionRules(rules, trigger)
    ];
  }

  /**
   * @function fieldValidate
   * 
   * @description 
   * 
   * @param name
   * @param rules
   * 
   * @memberof FormService
   */
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

  /**
   * @function getConditionRules
   * 
   * @description 
   * 
   * @param rules 
   * @param trigger 
   * 
   * @memberof FormService
   */
  private getConditionRules(rules: FieldRules | FieldRules[] | undefined, trigger: 'blur' | 'change') {
    if (Array.isArray(rules)) {
      return rules.filter(value => this.isContain(value.trigger, trigger));
    } else if (rules && this.isContain(rules.trigger, trigger)) {
      return [rules];
    } else {
      return [];
    }
  }

  /**
   * 
   * @param rules 
   * 
   * @memberof FormService
   */
  private getRuleArray(rules: FieldRules | FieldRules[] | undefined) {
    if (Array.isArray(rules)) {
      return rules;
    } else if (rules) {
      return [rules];
    } else {
      return [];
    }
  }

  /**
   * @function isContain
   * 
   * @description to test if a value is equal to a value
   *  or to test if a values contain a value.
   * 
   * @param values value or values
   * @param target target rule
   * 
   * @memberof FormSerivce
   */
  private isContain<T>(values: MaybeArray<T>, target: T) {
    return Array.isArray(values) ? values.indexOf(target) !== -1 : values === target;
  }
}



import {
  InjectionKey,
  inject,
  provide,
  ComputedRef,
  computed,
  Ref,
  ref,
  toRaw,
} from 'vue';
import { get as _get, set as _set } from 'lodash';
import Schema, { ErrorList, FieldErrorList, Rules } from 'async-validator';

const formGroupToken = Symbol() as InjectionKey<FormGroup<unknown>>;

const formControlToken = Symbol() as InjectionKey<FormControl>;

const useFormGroup = () => {};

const useFormItem = () => {};

export class FormGroup<T> {
  token = Symbol() as InjectionKey<FormGroup<unknown>>;

  data: Ref<T>;
  rules: Rules;
  schema: Schema;
  errorList: Ref<ErrorList>;
  fieldErrors: Ref<FieldErrorList>;
  valid: Ref<boolean>;
  focused: Ref<{ [key: string]: boolean }>;

  constructor(data: T) {
    this.data = ref(null as any);
    this.data.value = data;
    this.rules = {};
    this.schema = new Schema(this.rules);
    this.errorList = ref([]);
    this.fieldErrors = ref({});
    this.valid = computed(() =>
      this.errorList.value.length > 0 ? false : true
    );
    this.focused = ref({});
    provide(formGroupToken, this);
    provide(this.token, this);
  }

  setRules(rules: Rules) {
    this.rules = rules;
    this.schema = new Schema(this.rules);
  }

  validate() {
    this.schema.validate(
      toRaw(this.data.value),
      {},
      (errors: any, res: any) => {
        this.errorList.value = errors;
        this.fieldErrors.value = res;
        console.log(this);
      }
    );
  }
}

/**
 * @description
 * handle form input
 * binding formModelService with
 * use it in formItem or input like component
 * @date 2020-09-12
 * @export
 * @class FormControl
 */
export default class FormControl {
  /**
   * @description
   * root service in FormModelService formation
   * @type {FormGroup<any>}
   * @memberof FormInputService
   */
  root: FormGroup<any>;

  /**
   * @description
   * parent item
   * @type {FormInputService}
   * @memberof FormControl
   */
  parent: FormControl;

  /**
   * @description
   * key list from root data or other data
   * form input service do not manage is own data
   * just get agent from root
   * @type {string[]}
   * @memberof FormInputService
   */
  keyList: string[] = [];
  key = '';
  validateOn: 'blur' | 'change' = 'change';

  errorList: ComputedRef<ErrorList>;

  get data() {
    return _get(this.root.data, ['value', ...this.keyList]);
  }

  set data(val: any) {
    _set(this.root.data, ['value', ...this.keyList], val);
    if (this.validateOn === 'change') {
      this.root.validate();
    }
  }

  get touched() {
    return _get(this.root.focused, ['value', ...this.keyList]);
  }
  focus = () => {
    _set(this.root.focused, ['value', ...this.keyList], true);
  };
  blur = () => {
    _set(this.root.focused, ['value', ...this.keyList], false);
    if (this.validateOn === 'blur') {
      this.root.validate();
    }
  };
  constructor(
    key?: string,
    initialValue?: any,
    rootToken?: InjectionKey<FormGroup<any>>
  ) {
    if (rootToken) {
      this.root = inject(rootToken, null);
    } else {
      this.root = inject(formGroupToken);
    }

    this.parent = inject(formControlToken, null);
    this.bindKey(key);
    if (this.root && initialValue !== undefined) {
      _set(this.root.data, ['value', ...this.keyList], initialValue);
    }

    if (!this.root) {
      throw new Error('formInputService needs a formModelService as a root');
    }

    this.errorList = computed(() => {
      console.log(this.root.fieldErrors.value);
      const errorKeys = Object.keys(this.root.fieldErrors.value);
      const currentError = errorKeys.find(
        (err) => err === this.keyList.join('.')
      );
      if (currentError) {
        return this.root.fieldErrors.value[currentError];
      } else {
        return [];
      }
    });
    provide(formControlToken, this);
  }

  /**
   * @description
   * bind key and keyList
   * to get the control of root data
   * @date 2020-09-12
   * @param {string} [key]
   * @memberof FormInputService
   */
  bindKey(key?: string) {
    // if parent exists
    // key will indicate that use the parent's keyList or not
    // if parent also have no keyList or neither have key none parent
    // then service cannot work, throw an error
    this.key = key || '';
    if (this.parent) {
      if (key) {
        this.keyList = [...this.parent.keyList, key];
      } else {
        if (!this.parent.key) {
          throw new Error('formInputService need key to indicate model');
        }
        this.key = this.parent.key;
        this.keyList = this.parent.keyList;
      }
    } else {
      // neither parent no key
      // some error
      if (!this.key) {
        throw new Error('formInputService need key to indicate model');
      }
      this.keyList = [this.key];
    }
  }
}

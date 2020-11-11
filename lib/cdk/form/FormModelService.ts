import { InjectionKey, Ref, ref, provide, computed, toRaw } from "vue";
import Utils from "../core/Utils";
import Schema, { Rules, ErrorList, FieldErrorList } from "async-validator";

export default class FormModelService<T> {
  static token: InjectionKey<FormModelService<unknown>> = "cdk-Form" as any;
  token: InjectionKey<FormModelService<unknown>> = Utils.token() as any;

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
    provide(FormModelService.token, this);
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

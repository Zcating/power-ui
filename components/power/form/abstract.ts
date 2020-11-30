// import {
//   InjectionKey,
//   inject,
//   provide,
//   ComputedRef,
//   computed,
//   Ref,
//   ref,
//   toRaw,
//   shallowRef,
//   markRaw,
// } from 'vue';
// import { get as _get, set as _set } from 'lodash';
// import Schema, { ErrorList, FieldErrorList, Rules } from 'async-validator';

import { Rules } from 'async-validator';
import { inject, InjectionKey, provide, Ref, toRaw } from 'vue';


// type FormControls = { [key in string]: FormControl | FormGroup };

// export const buildFormControl = (formState: any, rules?: Rules) => {
//   return new FormControl(formState, rules);
// };

// export const buildFormGroup = (controls: FormControls) => {
//   const createControl = (controlConfig: any): FormControl | FormGroup => {
//     if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup) {
//       return controlConfig;
//     } else if (Array.isArray(controlConfig)) {
//       return new FormControl(controlConfig[0], controlConfig[1]);
//     } else {
//       return new FormControl(controlConfig);
//     }
//   };

//   const reduceControls = (controlsConfig: FormControls) => {
//     const controls: FormControls = {};
//     Object.keys(controlsConfig).forEach(controlName => {
//       controls[controlName] = createControl(controlsConfig[controlName]);
//     });
//     return controls;
//   };

//   return markRaw(new FormGroup(reduceControls(controls)));
// };




// export class FormGroup {
//   private initData: Record<string, unknown> | null = null;
//   private schema?: Schema;
//   errors: Ref<ErrorList> = shallowRef([]);
//   fieldErrors: Ref<FieldErrorList> = shallowRef({});
//   focusedKeys: Ref<{ [key: string]: boolean }> = ref({});

//   valid: Ref<boolean> = computed(() =>
//     this.errors.value.length > 0 ? false : true
//   );


//   constructor(controls: FormControls) {

//   }

//   addControl(name: string, controls: FormControl) {

//   }

//   reduceControls(controlsConfig: FormControls) {
//     const controls: FormControls = {};
//     Object.keys(controlsConfig).forEach(controlName => {
//       controls[controlName] = this.createControl(controlsConfig[controlName]);
//     });
//     return controls;
//   }

//   createControl(controlConfig: any): FormControl | FormGroup {
//     if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup) {
//       return controlConfig;
//     } else if (Array.isArray(controlConfig)) {
//       return new FormControl(controlConfig[0], controlConfig[1]);
//     } else {
//       return new FormControl(controlConfig);
//     }
//   }

//   setData(data: Record<string, unknown>) {
//     this.data$.value = data;
//     this.initData = data;
//     return this;
//   }


//   async validate() {
//     return await this.schema.validate(
//       toRaw(this.data$.value),
//       {},
//       (errors, res) => {
//         this.errors.value = errors;
//         this.fieldErrors.value = res;
//       }
//     );

//   }

//   reset() {
//     this.data$.value = this.initData;
//   }

//   setDataItem(names: string[], value: any) {
//     const data = this.data$.value;
//     if (!data) {
//       return;
//     }
//     _set(data, names, value);
//   }

//   item(names: string[]) {
//     const data = this.data$.value;
//     if (!data) {
//       return;
//     }
//     _get(data, names);
//   }
// }

// /**
//  * @description
//  * control form input
//  * binding formGroup with
//  * use it in formItem or input like component
//  * @date 2020-09-12
//  * @export
//  * @class FormControl
//  */
// class FormControl {
//   valueRef: Ref<any> = shallowRef(undefined);

//   private pendingValue: any = undefined;

//   constructor(
//     formState: any = null,
//     private rules?: Rules,
//   ) {
//     this._applyFormState(formState);
//   }

//   reset() {
//     this.valueRef.value = this.pendingValue;
//   }

//   validate() {

//   }

//   private _applyFormState(formState: any) {
//     this.valueRef.value = this.pendingValue = formState;
//   }
// }

const token = Symbol() as InjectionKey<FormSerivce>;

const useFormService = () => inject(token);

export class FormSerivce {
  private readonly pendingState: { [key in string]: any } = {};
  constructor(
    private state: Ref<Record<string, any>>,
    private rules: Rules
  ) {
    this.pendingState = toRaw(state.value);
    provide(token, this);
  }

  reset() {
    this.state.value = this.pendingState;
  }
}



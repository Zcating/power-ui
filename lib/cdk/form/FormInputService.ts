import { InjectionKey, inject, provide, ComputedRef, computed } from 'vue'
import FormModelService from './FormModelService'
import { get as _get, set as _set } from 'lodash'
import { ErrorList } from 'async-validator'


/**
 * @description
 * handle form input
 * binding formModelService with
 * use it in formItem or input like component
 * @date 2020-09-12
 * @export
 * @class FormInputService
 */
export default class FormInputService {
  static token: InjectionKey<FormInputService> = 'cdk-form-input' as any


  /**
   * @description
   * root service in FormModelService formation
   * @type {FormModelService<any>}
   * @memberof FormInputService
   */
  root: FormModelService<any>

  /**
   * @description
   * parent item
   * @type {FormInputService}
   * @memberof FormInputService
   */
  parent: FormInputService


  /**
   * @description
   * key list from root data or other data
   * form input service do not manage is own data
   * just get agent from root
   * @type {string[]}
   * @memberof FormInputService
   */
  keyList: string[] = []
  key = ''
  validateOn: 'blur' | 'change' = 'change'

  errorList: ComputedRef<ErrorList>

  get data() {
    return _get(this.root.data, ['value', ...this.keyList])
  }

  set data(val: any) {
    _set(this.root.data, ['value', ...this.keyList], val)
    if (this.validateOn === 'change') {
      this.root.validate()
    }
  }

  get touched() {
    return _get(this.root.focused, ['value', ...this.keyList])
  }
  focus = () => {
    _set(this.root.focused, ['value', ...this.keyList], true)
  }
  blur = () => {
    _set(this.root.focused, ['value', ...this.keyList], false)
    if (this.validateOn === 'blur') {
      this.root.validate()
    }
  }
  constructor(key?: string, initialValue?: any, rootToken?: InjectionKey<FormModelService<any>>) {
    if (rootToken) {
      this.root = inject(rootToken, null) as any
    } else {
      this.root = inject(FormModelService.token) as any
    }
    this.parent = inject(FormInputService.token, null) as any
    this.bindKey(key)
    if (this.root && initialValue !== undefined) {
      _set(this.root.data, ['value', ...this.keyList], initialValue)
    }
    if (!this.root) throw new Error('formInputService needs a formModelService as a root')
    this.errorList = computed(() => {
      console.log(this.root.fieldErrors.value)
      const errorKeys = Object.keys(this.root.fieldErrors.value)
      const currentError = errorKeys.find(err => err === this.keyList.join('.'))
      if (currentError) {
        return this.root.fieldErrors.value[currentError]
      } else {
        return []
      }
    })
    provide(FormInputService.token, this)

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
    this.key = key || ''
    if (this.parent) {
      if (key) {
        this.keyList = [...this.parent.keyList, key]
      } else {
        if (!this.parent.key) {
          throw new Error('formInputService need key to indicate model')
        }
        this.key = this.parent.key
        this.keyList = this.parent.keyList
      }
    } else {
      // neither parent no key
      // some error
      if (!this.key) {
        throw new Error('formInputService need key to indicate model')
      }
      this.keyList = [this.key]
    }
  }
}

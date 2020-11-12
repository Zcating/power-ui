import { vmodelRef } from '../cdk/hook';
import { Enum, renderCondition, toAttrComponent } from '../cdk/utils';
import { computed, CSSProperties, defineComponent, getCurrentInstance, nextTick, onMounted, onUpdated, Ref, ref, renderSlot, SetupContext, toRef, watch, resolveDynamicComponent, InputHTMLAttributes, TextareaHTMLAttributes } from "vue";
import { calcTextareaHeight } from './utils';
import { AutosizeData } from '.';

type InputElement = HTMLInputElement | HTMLTextAreaElement;


/**
 * @function useText
 * @description
 */
function useText(
  ctx: SetupContext,
  modelValue: Ref<any>,
  type: Ref<string>,
  disabled: Ref<boolean>,
  readonly: Ref<boolean>,
  showPassword: Ref<boolean>,
  showWordLimit: Ref<boolean>,
) {
  const textValue = computed(() => String(modelValue.value ?? ''));
  const textLength = computed(() => textValue.value.length);
  const upperLimit = computed(() => {
    const limit = Number(ctx.attrs.maxlength);
    return isNaN(limit) ? 0 : limit;
  });
  const isWordLimitVisible = computed(() => showWordLimit.value &&
    upperLimit.value &&
    (type.value === 'text' || type.value === 'textarea') &&
    !disabled &&
    !readonly &&
    !showPassword
  );
  const inputExceed = computed(() => isWordLimitVisible.value && (textLength.value > upperLimit.value));

  return {
    textValue,
    textLength,
    inputExceed,
    upperLimit,
    isWordLimitVisible,
  }
}


/**
 * @function useInput
 * @description
 */
function useInput(
  ctx: SetupContext,
  textValueRef: Ref<string>,
) {
  const inputRef = ref<HTMLInputElement>();
  const textareaRef = ref<HTMLTextAreaElement>();
  const focusedRef = ref(false);
  const isComposing = ref(false);

  const inputValue = vmodelRef(
    textValueRef,
    (value) => ctx.emit('update:modelValue', value),
    (value) => setNativeInputValue(value),
  );

  function getInput() {
    return inputRef.value || textareaRef.value;
  }

  function clear() {
    ctx.emit('input', '');
    ctx.emit('change', '');
    ctx.emit('clear');
    ctx.emit('update:modelValue', '');
  }

  function setNativeInputValue(value: string) {
    const input = getInput();
    if (!input || input.value === value) {
      return;
    }
    input.value = value;
  }

  function onFocus(event: Event) {
    focusedRef.value = true;
    ctx.emit('focus', event);
  }

  function onBlur(event: Event) {
    focusedRef.value = false;
    ctx.emit('blur', event);
  }


  function onChange(event: Event) {
    ctx.emit('change', (event.target! as InputElement).value);
  }

  function onInput(event: Event) {
    // should not emit input during composition
    // see: https://github.com/ElemeFE/element/issues/10516
    if (isComposing.value) {
      return;
    }

    if (typeof ctx.attrs.onInput === 'function') {
      ctx.attrs.onInput(event);
    } else {
      inputValue.value = (event.target as InputElement).value;
    }

    nextTick(() => {
      setNativeInputValue(inputValue.value);
    })
  }

  function onCompositionstart() {
    isComposing.value = true;
  }

  function onCompositionupdate(event: CompositionEvent) {
    // const text = event.data;
    // const lastCharacter = text[text.length - 1] || '';
    // isComposing.value = !isKorean(lastCharacter);
    isComposing.value = true;
  }

  function onCompositionend(event: CompositionEvent) {
    if (isComposing.value) {
      isComposing.value = false;
      onInput(event);
    }
  }

  return {
    input: inputRef,
    textarea: textareaRef,
    focused: focusedRef,
    getInput,
    clear,
    onFocus,
    onBlur,
    onChange,
    onInput,
    onCompositionstart,
    onCompositionupdate,
    onCompositionend,
  }
}


/**
 * @function useClear
 * @description
 * Caculates when the clear icon 
 * need to show.
 */
function useClear(
  clearable: Ref<boolean | undefined>,
  disabled: Ref<boolean | undefined>,
  readonly: Ref<boolean | undefined>,
  focus: Ref<boolean>,
  inputValue: Ref<string>,
) {
  const hovering = ref(false);
  const showClear = computed(() => {
    return clearable.value &&
      !disabled.value &&
      !readonly.value &&
      !!inputValue.value &&
      (focus.value || hovering.value);
  });

  const setHovering = (value: boolean) => hovering.value = value;

  return {
    showClear,
    setHovering,
  }
}

/**
 * @function usePassword
 * @description
 * Caculates when the password needs to show.
 */
function usePassword(
  showPassword: Ref<boolean | undefined>,
  disabled: Ref<boolean | undefined>,
  readonly: Ref<boolean | undefined>,
  focus: Ref<boolean>,
  inputValue: Ref<any>,
  inputFocus: () => void
) {
  const passwordVisible = ref(false);

  const showPwdVisible = computed(() => {
    return showPassword.value &&
      !readonly.value &&
      !disabled.value &&
      (focus.value || !!inputValue.value);
  });

  const onPasswordVisible = () => {
    passwordVisible.value = !passwordVisible.value;
    inputFocus();
  }

  const passwordType = computed(() => passwordVisible.value ? 'text' : 'password');


  return {
    passwordVisible,
    showPwdVisible,
    passwordType,
    onPasswordVisible
  }
}

/**
 * @function computeTextAreaStyle
 * @description
 */
function computeTextAreaStyle(
  textareaRef: Ref<HTMLTextAreaElement | undefined>,
  modelValueRef: Ref<string>,
  typeRef: Ref<string>,
  autosizeRef: Ref<AutosizeData | boolean | undefined>,
  resizeRef: Ref<string | undefined>
) {
  const textareaCalcStyle = ref<CSSProperties>({});
  onMounted(() => {
    watch([textareaRef, autosizeRef, typeRef, modelValueRef], (values) => {
      const textarea = values[0] as HTMLTextAreaElement;
      const autosize = values[1] as AutosizeData | boolean | undefined;
      const type = values[2] as string;

      if (type !== 'textarea' || !textarea) {
        return;
      }

      nextTick(() => {
        if (!autosize) {
          textareaCalcStyle.value = {
            minHeight: calcTextareaHeight(textarea).minHeight
          };
          return;
        }

        let minRows, maxRows;
        if (typeof autosize === 'object') {
          minRows = autosize.minRows;
          maxRows = autosize.maxRows;
        }

        textareaCalcStyle.value = calcTextareaHeight(textarea, minRows, maxRows);
      });
    }, { immediate: true });
  });

  return computed(() => ({ ...textareaCalcStyle.value, resize: resizeRef.value } as CSSProperties));
}

/**
 * @function positionIcon
 * @description
 */
function positionIcon(
  ctx: SetupContext,
  type: Ref<string>
) {

  function calcIconOffset(container: HTMLElement, place: 'prefix' | 'suffix') {
    const elList = Array.prototype.slice.call(container.querySelectorAll(`.el-input__${place}`) || []);
    if (elList.length === 0) {
      return;
    }
    const el = elList.find((value) => value.parentNode === container);
    if (!el) {
      return;
    }
    const pendantMap = {
      suffix: 'append',
      prefix: 'prepend'
    };

    const pendant = pendantMap[place];
    if (ctx.slots[pendant]) {
      const queried = container.querySelector(`.el-input-group__${pendant}`) as HTMLElement;
      if (queried) {
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${queried.offsetWidth}px)`;
      }
    } else {
      el.removeAttribute('style');
    }
  }

  function updateIconOffset() {
    const instance = getCurrentInstance();
    if (!instance) {
      return;
    }
    calcIconOffset(instance.vnode.el as HTMLElement, 'prefix');
    calcIconOffset(instance.vnode.el as HTMLElement, 'suffix');
  }

  onMounted(() => {
    watch(type, () => {
      updateIconOffset();
    }, { immediate: true });
  });

  onUpdated(() => {
    nextTick(() => updateIconOffset());
  });
}

export const Input = toAttrComponent<InputHTMLAttributes>()(defineComponent({
  name: 'el-input',
  // prevent the $attrs applys to <div>
  inheritAttrs: false,

  props: {
    modelValue: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Enum<'text' | 'textarea'>(),
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    validateEvent: {
      type: [Boolean, String],
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: Number,
  },


  emits: [
    'update:modelValue',
    'input', 
    'focus', 
    'blur',
    'clear',
    'change',
  ],

  setup(props, ctx: SetupContext) {
    const typeRef = toRef(props, 'type');
    const diabledRef = toRef(props, 'disabled');
    const readonlyRef = toRef(props, 'readonly');
    const inputSize = toRef(props, 'size');
    const showPassword = toRef(props, 'showPassword');
    const inputDisabled = diabledRef;

    const textState = useText(
      ctx,
      toRef(props, 'modelValue'),
      typeRef,
      diabledRef,
      readonlyRef,
      showPassword,
      toRef(props, 'showWordLimit')
    );

    const inputState = useInput(
      ctx,
      textState.textValue,
    );

    const clearState = useClear(
      toRef(props, 'clearable'),
      diabledRef,
      readonlyRef,
      inputState.focused,
      textState.textValue
    );

    const pwdState = usePassword(
      showPassword,
      diabledRef,
      readonlyRef,
      inputState.focused,
      textState.textValue,
      () => inputState.getInput()?.focus()
    );

    const textareaStyle = computeTextAreaStyle(
      inputState.textarea,
      textState.textValue,
      typeRef,
      toRef(props, 'autosize'),
      toRef(props, 'resize')
    );

    positionIcon(ctx, typeRef);

    return {
      // form
      validateState: false,
      validateIcon: '',
      needStatusIcon: false,
      statusIcon: false,

      inputSize,
      inputDisabled,

      //
      ...textState,
      ...inputState,
      ...clearState,
      ...pwdState,

      textareaStyle,
    }
  },

  render() {
    const {
      $slots,
      $attrs,
      type,
      prefixIcon,
      suffixIcon,
      clearable,
      showPassword,
      tabindex,
      readonly,
      label,
      autocomplete,
      inputSize,
      inputDisabled,
      inputExceed,
      passwordVisible,
      showClear,
      showPwdVisible,
      isWordLimitVisible,
      validateState,
      validateIcon,
      textLength,
      upperLimit,
      textareaStyle,
      onCompositionstart,
      onCompositionupdate,
      onCompositionend,
      onInput,
      onFocus,
      onBlur,
      onChange,
      onPasswordVisible,
      clear,
      setHovering,
    } = this;

    const getSuffixVisible = () => {
      return !!this.$slots.suffix ||
        !!this.suffixIcon ||
        !!this.showClear ||
        !!this.showPassword ||
        !!this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon);
    }

    return (
      <div
        class={[
          type === 'textarea' ? 'el-textarea' : 'el-input',
          inputSize ? 'el-input--' + inputSize : '',
          {
            'is-disabled': inputDisabled,
            'is-exceed': inputExceed,
            'el-input-group': !!($slots.prepend || $slots.append),
            'el-input-group--append': !!$slots.append,
            'el-input-group--prepend': !!$slots.prepend,
            'el-input--prefix': !!($slots.prefix || prefixIcon),
            'el-input--suffix': !!($slots.suffix || suffixIcon || clearable || showPassword)
          },
        ]}
        onMouseenter={() => setHovering(true)}
        onMouseleave={() => setHovering(false)}
      >
        {renderCondition(
          type !== 'textarea',
          [
            renderCondition(
              $slots.prepend,
              (<div class="el-input-group__prepend">
                {renderSlot($slots, 'prepend')}
              </div>),
            ),
            renderCondition(
              type !== 'textarea',
              <input
                ref="input"
                class="el-input__inner"
                type={showPassword ? (passwordVisible ? 'text' : 'password') : type}
                disabled={inputDisabled}
                readonly={readonly}
                autocomplete={autocomplete}
                onCompositionstart={onCompositionstart}
                onCompositionupdate={onCompositionupdate}
                onCompositionend={onCompositionend}
                onInput={onInput}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                aria-label={label}
                tabindex={tabindex}
                {...$attrs}
              />
            ),
            // 前置内容
            renderCondition(
              $slots.prefix || prefixIcon,
              <span class="el-input__prefix">
                {renderSlot(this.$slots, 'prefix')}
                <i class={["el-input__icon", prefixIcon]} />
              </span>,
            ),
            // 后置内容
            renderCondition(
              getSuffixVisible(),
              <span class="el-input__suffix">
                <span class="el-input__suffix-inner">
                  {[
                    renderCondition(
                      !showClear || !showPwdVisible || !isWordLimitVisible,
                      [
                        renderSlot(this.$slots, 'suffix'),
                        renderCondition(suffixIcon, <i class={`el-input__icon ${suffixIcon}`} />)
                      ]
                    ),
                    renderCondition(
                      showClear,
                      <i
                        class="el-input__icon el-icon-circle-close el-input__clear"
                        onMousedown={e => e.preventDefault()}
                        onClick={clear}
                      />
                    ),
                    renderCondition(
                      showPwdVisible,
                      <i
                        class="el-input__icon el-icon-view el-input__clear"
                        onClick={onPasswordVisible}
                      />
                    ),
                    renderCondition(
                      isWordLimitVisible,
                      <span class="el-input__count">
                        <span class="el-input__count-inner">
                          {textLength}/{upperLimit}
                        </span>
                      </span>
                    ),
                  ]}
                </span>
                {renderCondition(
                  validateState,
                  <i class={['el-input__icon', 'el-input__validateIcon', validateIcon]} />
                )}
              </span>
            ),

            // <!-- 后置元素 -->
            renderCondition(
              this.$slots.append,
              <div class="el-input-group__append">
                {renderSlot(this.$slots, 'append')}
              </div>
            ),
          ],
          <textarea
            tabindex={tabindex}
            class="el-textarea__inner"
            onCompositionstart={onCompositionstart}
            onCompositionupdate={onCompositionupdate}
            onCompositionend={onCompositionend}
            onInput={onInput}
            ref="textarea"
            disabled={inputDisabled}
            readonly={readonly}
            autocomplete={autocomplete}
            style={textareaStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            aria-label={label}
            {...$attrs}
          />
        )}
        {renderCondition(
          isWordLimitVisible && type === 'textarea',
          <span class="el-input__count">{{ textLength }}/{{ upperLimit }}</span>
        )}
      </div>
    );
  }
}));

import { RuleItem } from 'async-validator';
import { ElSize } from 'power-ui/types';
import { cloneVNode, computed, defineComponent, getCurrentInstance, onMounted, reactive, ref, toRef, Transition, VNode, watch } from 'vue';
import { coerceCssPixelValue } from 'vue-cdk/coercion';
import { usePlatform } from 'vue-cdk/global';
import { Enum, List, Model, renderCondition } from 'vue-cdk/utils';
import { FormRef } from './form';
import { useFormService } from './form.service';

export const FormItem = defineComponent({
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: {
      type: Enum<ElSize>(),
      default: ''
    },
    rules: {
      type: [Model<RuleItem>(), List<RuleItem>()],
    }
  },
  setup(props, ctx) {
    const labelRef = ref<HTMLLabelElement | null>(null);
    const platform = usePlatform();
    const computedWidth = computed(() => {
      const label = labelRef.value;
      if (label) {
        return Math.ceil(parseFloat(platform.TOP?.getComputedStyle(label).width ?? '0'));
      } else {
        return 0;
      }
    });

    const wrapStyle = computed(() => {
      const width = coerceCssPixelValue(props.width);
      if (width && width !== 'auto') {
        const marginLeft = parseInt(width, 10) - computedWidth.value;
        if (marginLeft) {
          return { marginLeft: `${marginLeft}px` };
        }
      }
    });

    const instance = getCurrentInstance();
    const labelStyle = computed(() => {
      const {
        labelPosition = undefined,
        labelWidth = undefined
      } = (instance?.proxy?.$parent as FormRef);

      if (labelPosition === 'top') {
        return undefined;
      }
      return { width: labelWidth };
    });

    const contentStyle = computed(() => {
      const { label, width } = props;
      const { labelPosition, inline, labelWidth } = (instance?.proxy?.$parent as FormRef);
      if (labelPosition === 'top' || inline || !(label || width)) {
        return;
      }
      if (labelWidth === 'auto') {
        if (width === 'auto') {
          return { marginLeft: computedWidth.value };
        } else if (labelWidth === 'auto') {
          return { marginLeft: width };
        }
      } else {
        return { marginLeft: labelWidth || width };
      }
    });

    const inlineError = computed(() => {
      const formInlineMsg = instance?.parent?.props.inlineMessage ?? true;
      return typeof props.inlineMessage === 'boolean' ? props.inlineMessage : formInlineMsg;
    });


    /* Using form service */

    const validate = reactive({ status: '', message: '' });
    const formService = useFormService();
    const fieldRef = ref<HTMLDivElement | null>(null);
    if (formService) {
      formService.bindErrors(props.name, (errors) => {
        validate.status = !errors ? 'success' : 'error';
        validate.message = errors ? errors[0].message : '';
      });
      onMounted(() => {
        const el = fieldRef.value;
        if (!el) {
          return;
        }
        // formService.onFieldBlur(el, props.name, props.rules);
        // formService.onFieldChange(el, props.name, props.rules);
      });
    }

    return () => {
      const { message: validateMessage, status: validateStatus } = validate;
      const { hideRequiredAsterisk = false, showMessage = false, size = undefined } = instance?.parent?.props as any;
      const showError = validateStatus === 'error' && showMessage && props.showMessage;
      const showLabel = props.label || ctx.slots.label;
      const itemSize = props.size || size;
      const children = (ctx.slots.default?.() ?? []);
      if (children) {
        let firstChild = children[0];
        const originBlur = firstChild.props?.onBlur;
        const originChange = firstChild.props?.onChange;
        console.log(firstChild.props);
        firstChild = cloneVNode(firstChild, {
          onBlur: (event: FocusEvent) => {
            if (typeof originBlur === 'function') {
              originBlur(event);
            }
            formService?.handleFieldTrigger(props.name, props.rules, 'blur');
          },
          onChange: (value: any) => {
            if (typeof originChange === 'function') {
              originChange(value);
            }
            formService?.handleFieldTrigger(props.name, props.rules, 'change');
          }
        });
      }
      return (
        <div
          class={[
            'el-form-item',
            'el-form-item--feedback',
            {
              'is-error': validateStatus === 'error',
              'is-validating': validateStatus === 'validating',
              'is-success': validateStatus === 'success',
              'is-required': false,
              'is-no-asterisk': hideRequiredAsterisk
            },
            itemSize ? `el-form-item--${itemSize}` : ''
          ]}
        >
          {renderCondition(
            showLabel,
            () => (
              <div class="el-form-item__label-wrap" style={wrapStyle.value}>
                <label for={props.name} ref={labelRef} class="el-form-item__label" style={labelStyle.value}>
                  {ctx.slots.label?.()}
                  {props.label}
                </label>
              </div>
            )
          )}
          <div ref={fieldRef} class="el-form-item__content" style={contentStyle.value}>
            {children}
            <Transition name="el-zoom-in-top">
              {renderCondition(
                showError,
                () => (
                  <div
                    class={[
                      'el-form-item__error',
                      inlineError.value ? 'el-form-item__error--inline' : ''
                    ]}
                  >
                    {validateMessage}
                  </div>
                )
              )}
            </Transition>
          </div>
        </div>
      );
    };
  }
});

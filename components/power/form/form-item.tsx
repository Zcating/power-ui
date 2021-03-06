// vendor
import { cloneVNode, computed, defineComponent, reactive, ref, Transition, useContext } from 'vue';
import { RuleItem } from 'async-validator';

// cdk
import { usePlatform, coerceCssPixelValue } from 'vue-cdk';
import { Enum, List, Model } from 'vue-cdk/utils';

// power-ui
import { useFormService } from './form.service';
import { FieldRules } from './types';
import { ElSize } from '../types';

import { useFormStyle } from './form.style';

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
      type: [Model<FieldRules>(), List<FieldRules>()],
    },
    autoLink: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, ctx) {
    const platform = usePlatform();
    const labelRef = ref<HTMLLabelElement | null>(null);
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

    const formStyle = useFormStyle();

    const labelStyle = computed(() => {
      const { labelPosition, labelWidth } = formStyle;

      if (labelPosition === 'top') {
        return undefined;
      }
      return { width: labelWidth };
    });

    const contentStyle = computed(() => {
      const { label, width } = props;
      const { labelPosition, inline, labelWidth } = formStyle;
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
      return typeof props.inlineMessage === 'boolean' ? props.inlineMessage : formStyle.inlineMessage;
    });

    /* Using form service */
    // validate state
    const validate = reactive({ status: '', message: '' });

    const formService = useFormService();
    // form service bind validate
    formService?.bindValidate(props.name, props.rules, (result: string[]) => {
      validate.status = result.length > 0 ? 'error' : 'success';
      validate.message = result[0] ?? '';
    });

    // required rules abstract
    const isRequired = (item: RuleItem[] | RuleItem | undefined) => {
      return Array.isArray(item) ? item.some((value) => value.required) : item?.required;
    };

    // test required
    const required = computed(() => {
      const fieldRules = formService?.rulesRef.value[props.name];
      const { rules } = props;
      const required1 = isRequired(fieldRules);
      const required2 = isRequired(rules);
      return !!(required1 || required2);
    });

    const handleFieldTrigger = async (trigger: 'blur' | 'change') => {
      const rules = formService?.validateRules(props.name, props.rules, trigger);
      if (!rules || rules.length === 0) {
        return;
      }

      validate.status = 'validating';
      const result = await formService?.fieldValidate(props.name, rules) ?? [];
      validate.status = result.length > 0 ? 'error' : 'success';
      validate.message = result[0] ?? '';
    };

    return () => {
      const { message: validateMessage, status: validateStatus } = validate;
      const { label, showMessage, size, } = props;
      const showError = validateStatus === 'error' && formStyle.showMessage && showMessage;
      const showLabel = label || ctx.slots.label;
      const itemSize = size || formStyle.size;

      // to add the blur & change events to the first child
      const children = (ctx.slots.default?.() ?? []);
      if (children.length > 0 && props.autoLink) {
        const firstChild = children[0];
        const originBlur = firstChild.props?.onBlur;
        const originChange = firstChild.props?.onChange;
        children[0] = cloneVNode(firstChild, {
          onBlur: (event: FocusEvent) => {
            if (typeof originBlur === 'function') {
              originBlur(event);
            }
            handleFieldTrigger('blur');
          },
          onChange: (value: any) => {
            if (typeof originChange === 'function') {
              originChange(value);
            }
            handleFieldTrigger('change');
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
              'is-required': required.value,
              'is-no-asterisk': formStyle.hideRequiredAsterisk
            },
            itemSize ? `el-form-item--${itemSize}` : ''
          ]}
        >
          {showLabel ? (
            <div class="el-form-item__label-wrap" style={wrapStyle.value}>
              <label for={props.name} ref={labelRef} class="el-form-item__label" style={labelStyle.value}>
                {ctx.slots.label?.()}
                {props.label}
              </label>
            </div>
          ) : null}
          <div
            class="el-form-item__content"
            style={contentStyle.value}
          >
            {children}
            <Transition name="el-zoom-in-top">
              {showError ? (
                <div
                  class={[
                    'el-form-item__error',
                    inlineError.value ? 'el-form-item__error--inline' : ''
                  ]}
                >
                  {validateMessage}
                </div>
              ) : null}
            </Transition>
          </div>
        </div>
      );
    };
  }
});

import { computed, CSSProperties, defineComponent, getCurrentInstance, reactive, ref, Transition } from 'vue';
import { coerceCssPixelValue } from 'vue-cdk/coercion';
import { usePlatform } from 'vue-cdk/global';
import { renderCondition } from 'vue-cdk/utils';

export const FormItem = defineComponent({
  props: {
    label: {
      type: [String, Number],
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
    }
  },
  setup(props, ctx) {
    const state = reactive({
      validateState: '',
      validateMessage: '',
    });

    const elForm: Record<string, any> = {};

    // const group = useFormGroup();

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
      const style: CSSProperties = {};
      if (width && width !== 'auto') {
        const marginLeft = parseInt(width, 10) - computedWidth.value;
        if (marginLeft) {
          style.marginLeft = marginLeft + 'px';
        }
      }
      return style;
    });

    const instance = getCurrentInstance();
    const labelStyle = computed(() => {
      const {
        labelPosition = undefined,
        labelWidth = undefined
      } = instance?.parent?.props as any;

      if (labelPosition === 'top') {
        return undefined;
      }
      return { width: labelWidth };
    });

    return () => {
      const { inlineMessage, showMessage } = props;
      const { validateMessage, validateState } = state;
      const inlineError = typeof inlineMessage === 'boolean' ? inlineMessage : (elForm && elForm.inlineMessage || false);

      return (
        <div
          class={[
            'el-form-item',
            'el-form-item--feedback',
            {
              'is-error': validateState === 'error',
              'is-validating': validateState === 'validating',
              'is-success': validateState === 'success',
              'is-required': false,
              'is-no-asterisk': elForm && elForm.hideRequiredAsterisk
            }
          ]}
        >
          {renderCondition(
            props.label || ctx.slots.label,
            <div class="el-form-item__label-wrap" style={wrapStyle.value}>
              <label ref={labelRef} class="el-form-item__label" style={labelStyle.value}>
                {props.label}
              </label>
            </div>
          )}
          <div>
            {ctx.slots.default?.()}
            <Transition name="el-zoom-in-top">
              {renderCondition(
                validateState === 'error' && showMessage && elForm.showMessage,
                () => [
                  ctx.slots.error?.({ errror: validateMessage }),
                  <div
                    class={[
                      'el-form-item__error',
                      inlineError ? 'el-form-item__error--inline' : ''
                    ]}
                  >
                    {validateMessage}
                  </div>
                ]
              )}
            </Transition>
          </div>
        </div>
      );
    };
  }
});

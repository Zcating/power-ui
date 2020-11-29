import { defineComponent, reactive, ref, Transition } from 'vue';
import { renderCondition } from 'vue-cdk/utils';

export const FormItem = defineComponent({
  props: {
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

    return () => {
      const { inlineMessage, showMessage } = props;
      const { validateMessage, validateState } = state;
      const inlineError = typeof inlineMessage === 'boolean' ? inlineMessage : (elForm && elForm.inlineMessage || false);
      return (
        <div>
          <label>

          </label>
          <div>
            {ctx.slots.default?.()}
            <Transition name="el-zoom-in-top">
              {renderCondition(
                validateState === 'error' && showMessage && elForm.showMessage,
                () => ctx.slots.error?.({ errror: validateMessage })
              )}
              <div
                class={[
                  'el-form-item__error',
                  {
                    'el-form-item__error--inline': inlineError
                  }
                ]}
              >
                {validateMessage}
              </div>
            </Transition>
          </div>
        </div>
      );
    };
  }
});

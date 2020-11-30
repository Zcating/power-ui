import { ElSize } from 'power-ui/types';
import { defineComponent } from 'vue';
import { Enum } from 'vue-cdk/utils';
// import { FormGroup } from './abstract';

type LabelPosition = 'left' | 'right' | 'top';

export const Form = defineComponent({
  props: {
    model: {
      type: Object,
    },
    rules: {
      type: Object,
    },
    labelPosition: Enum<LabelPosition>(),
    labelWidth: {
      type: String,
      default: ''
    },
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    size: {
      type: Enum<ElSize>(),
      default: 'medium'
    },
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    return () => (
      <form
        class={[
          'el-form',
          props.labelPosition ? 'el-form--label-' + props.labelPosition : ''
        ]}
      >
        {ctx.slots.default?.()}
      </form>
    );
  }
});
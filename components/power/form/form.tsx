import { defineComponent, toRef } from 'vue';
import { Enum, Model } from 'vue-cdk/utils';
import { ElSize } from 'power-ui/types';
import { FormSerivce } from './form.service';
import { LabelPosition, FormRules } from './types';


export const Form = defineComponent({
  props: {
    model: {
      type: Object,
      default: {}
    },
    rules: {
      type: Model<FormRules>(),
      default: {}
    },
    labelPosition: {
      type: Enum<LabelPosition>(),
    },
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
    disabled: {
      type: Boolean,
      default: false
    },
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {

    const formService = new FormSerivce(toRef(props, 'model'), toRef(props, 'rules'));

    return {
      validate: () => formService.validate(),
      reset: (names: string[]) => formService.reset(names),
    };
  },
  render() {
    const { labelPosition, $slots: slots } = this;
    return (
      <form
        class={[
          'el-form',
          labelPosition ? 'el-form--label-' + labelPosition : ''
        ]}
      >
        {slots.default?.()}
      </form>
    );
  }
});

export type FormRef = InstanceType<typeof Form>;
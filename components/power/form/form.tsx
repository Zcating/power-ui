import { defineComponent, toRef } from 'vue';
import { Enum, Model } from 'vue-cdk/utils';
import { ElSize } from 'power-ui/types';
import { FormSerivce } from './form.service';
import { LabelPosition, FormRules } from './types';
import { provideFormStyle } from './form.style';


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
  setup(props, ctx) {

    provideFormStyle(props);

    const formService = new FormSerivce(toRef(props, 'model'), toRef(props, 'rules'));
    ctx.expose({
      validate: () => formService.validate(),
      reset: (names: string[]) => formService.reset(names),
    });

    return () => {
      const { labelPosition } = props;
      return (
        <form
          class={[
            'el-form',
            labelPosition ? 'el-form--label-' + labelPosition : ''
          ]}
        >
          {ctx.slots.default?.()}
        </form>
      );
    };
  },
});

export type FormRef = InstanceType<typeof Form> & {
  validate: () => void,
  reset: (names: string[]) => void
};
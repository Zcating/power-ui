import { defineComponent } from 'vue';
import { Enum } from 'vue-cdk/utils';

export const Form = defineComponent({
  props: {
    labelPosition: {
      type: Enum<string>(),
    },
    model: {

    }
  },
  setup(props, ctx) {
    return () => (
      <form class={['el-form', props.labelPosition ? 'el-form--label-' + props.labelPosition : '']}>
        {ctx.slots.default?.()}
      </form>
    );
  }
});
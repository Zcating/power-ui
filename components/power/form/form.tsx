import { defineComponent } from 'vue';
import { Enum } from 'vue-cdk/utils';
// import { FormGroup } from './abstract';

export const Form = defineComponent({
  props: {
    labelPosition: {
      type: Enum<string>(),
    },
    model: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
    },
    inline: {
      type: Boolean
    },
  },
  setup(props, ctx) {
    // const formGroup = 

    console.log(props.rules);

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
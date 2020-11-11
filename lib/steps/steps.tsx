import { Enum } from '../cdk/utils';
import { defineComponent, renderSlot, watch } from "vue";
import { StepService } from './step.service';
import { ElStepDirection, ElStepStatus } from './types';


export const Steps = defineComponent({
  props: {
    space: [Number, String],
    alignCenter: Boolean,
    simple: Boolean,
    active: {
      type: Number,
      default: 0,
    },
    direction: {
      type: Enum<ElStepDirection>(),
      default: 'horizontal'
    },
    finishStatus: {
      type: Enum<ElStepStatus>(),
      default: 'finish'
    },
    processStatus: {
      type: Enum<ElStepStatus>(),
      default: 'process'
    }
  },

  setup(props, ctx) {
    const service = new StepService(props);
    
    watch(() => props.active, (value, oldValue) => {
      ctx.emit('change', value, oldValue);
    });
  },

  render() {
    const { simple, direction, $slots } = this;
    return (
      <div
        class={[
          'el-steps',
          !simple && 'el-steps--' + direction,
          simple && 'el-steps--simple'
        ]}
      >
        { renderSlot($slots, 'default')}
      </div>
    );
  },
});
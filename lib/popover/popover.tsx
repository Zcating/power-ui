import { defineComponent, computed } from 'vue';
import { Enum } from '../cdk/utils';
import { Placement, Tooltip, TriggerType } from '../tooltip';

export const Popover = defineComponent({
  name: 'el-popover',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 150
    },
    placement: {
      type: Enum<Placement>(),
      default: 'top',
    },
    trigger: {
      type: Enum<TriggerType>(),
      default: 'click',
    },
    visibleArrow: {
      type: Boolean,
      default: true,
    },
    arrowOffset: {
      type: Number,
      default: 8,
    },
    tabindex: {
      type: Number,
      default: 0
    },
    enterable: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: 'el-fade-in-linear'
    },
    popperClass: String,
  },
  setup(props, ctx) {
    const popoverClass = computed(() => {
      const clazz = ['el-popover', 'el-popper'];
      if (props.popperClass) {
        clazz.push(props.popperClass);
      }
      if (props.content) {
        clazz.push('el-popover--plain');
      }
      return clazz;
    });

    return () => (
      <Tooltip
        ref="tooltip"
        trigger={props.trigger}
        popperClass={popoverClass.value}
        popperStyle={{ width: `${props.width}px` }}
        placement={props.placement}
        visibleArrow={props.visibleArrow}
        v-slots={{
          content: () => [
            <div class="el-popover__title">{props.title}</div>,
            ctx.slots.content ? ctx.slots.content() : (<div>{props.content}</div>)
          ],
          default: ctx.slots.default
        }}
      />
    );
  },

  data() {
    return {
      eltype: 'popover'
    };
  }
});

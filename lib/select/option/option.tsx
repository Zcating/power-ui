import { renderCondition } from '@/cdk/utils';
import { defineComponent, ref, renderSlot, toRef, watch } from "vue";
import { CdkSelectionItem } from '../../cdk';
import { watchRef } from '../../cdk/hook';
import { SelectSerivce } from '../select.service';

export const Option = defineComponent({
  name: 'el-option',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      default: '',
      required: true,
    },
    created: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props, ctx) {
    const elDisabled = watchRef(toRef(props, 'disabled'));
    const hover = ref(false);
    const limitReached = ref(false);

    // const innerLabel = watchRef(toRef(props, 'label'));

    const handleClick = (state: {selected: boolean}) => {
      state.selected = true;
    }

    const service = SelectSerivce.instance();
    const handleState = (state: {selected: boolean}) => {
      watch(() => state.selected, (value) => {
        if (!service) {
          return;
        }
        if (value) {
          service.updateValue({
            label: props.label,
            value: props.value
          });
        } else {
          service.removeValue(props.value);
        }
      }, {immediate: true});
    }

    return () => (
      <CdkSelectionItem 
        key={props.value}
        v-slots={{
          default: (state: { selected: boolean }) => {
            handleState(state)
            return (
              <li
                onMouseenter={() => hover.value = true}
                onMouseleave={() => hover.value = false}
                onClick={() => handleClick(state)}
                class={["el-select-dropdown__item", {
                  'selected': state.selected,
                  'is-disabled': elDisabled.value || limitReached.value,
                  'hover': hover.value
                }]}
              >
                {ctx.slots.default ? ctx.slots.default : props.label}
              </li>
            )
          }
        }} 
      />
    );
  }
});
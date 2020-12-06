import { defineComponent, ref, toRef, watch } from 'vue';
import { CdkSelectionItem } from 'vue-cdk/selection';
import { watchRef } from 'vue-cdk/hook';
import { useDescMap } from '../utils';

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
    const disabledRef = watchRef(toRef(props, 'disabled'));
    const hover = ref(false);
    const limitReached = ref(false);
    const selectedRef = ref(false);
    const map = useDescMap();
    if (map) {
      watch([() => props.label, () => props.value], ([label, value]) => {
        map.set(value, label as string);
      }, {
        immediate: true
      });
    }
    return () => (
      <CdkSelectionItem
        trackedKey={props.value}
        v-model={selectedRef.value}
      >
        <li
          onMouseenter={() => hover.value = true}
          onMouseleave={() => hover.value = false}
          onClick={() => selectedRef.value = true}
          class={['el-select-dropdown__item', {
            'selected': selectedRef.value,
            'is-disabled': disabledRef.value || limitReached.value,
            'hover': hover.value
          }]}
        >
          {ctx.slots.default ? ctx.slots.default?.() : props.label}
        </li>
      </CdkSelectionItem>
    );
  }
});
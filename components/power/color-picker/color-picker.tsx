import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref, toRef } from 'vue';
import { usePlatform } from 'vue-cdk';
import { watchRef } from 'vue-cdk/hook';
import { Enum } from 'vue-cdk/utils';
import { Placement, Tooltip } from '../tooltip';
import { Pallet } from './pallet';

export const ColorPicker = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '#ff0000ff'
    },
    colorFormat: String,
    disabled: Boolean,
    size: {
      type: String,
      default: 'default'
    },
    placement: {
      type: Enum<Placement>(),
      default: 'bottom'
    }
  },
  emits: ['update:modelValue'],

  setup(props, ctx) {
    const visible = ref(false);
    const color = watchRef(
      toRef(props, 'modelValue'),
      (value) => ctx.emit('update:modelValue', value)
    );

    const { DOCUMENT } = usePlatform();
    if (DOCUMENT) {
      const instance = getCurrentInstance()!;
      let outside = false;
      const down = () => outside = true;
      const up = () => {
        if (outside) {
          visible.value = false;
          outside = false;
        }
      };
      const inside = (e: Event) => {
        // stop the propagation as 
        // your can not trigger the DOCUMENT's event.
        e.stopImmediatePropagation();
        outside = false;
      };
      onMounted(() => {
        const ele = instance?.refs?.pallet as { $el: HTMLElement };
        if (ele) {
          ele.$el.addEventListener('mousedown', inside);
        }
        DOCUMENT.addEventListener('mousedown', down);
        DOCUMENT.addEventListener('mouseup', up);
      });
      onUnmounted(() => {
        const ele = instance?.refs?.pallet as { $el: HTMLElement };
        if (ele) {
          ele.$el.removeEventListener('mousedown', inside);
        }
        DOCUMENT.removeEventListener('mousedown', down);
        DOCUMENT.addEventListener('mouseup', up);
      });
    }

    return () => (
      <Tooltip
        v-model={visible.value}
        popperClass={'el-color-dropdown el-color-picker__panel'}
        placement={'bottom'}
        trigger={'custom'}
        v-slots={{
          content: () => <Pallet ref="pallet" v-model={color.value} />
        }}
      >
        <div class={['el-color-picker', `el-color-picker--${props.size}`]} onClick={() => visible.value = !visible.value}>
          <div class="el-color-picker__trigger">
            <span class="el-color-picker__color is-alpha">
              <span class="el-color-picker__color-inner" style={{ background: color.value }} />
            </span>
            <span class={['el-color-picker__icon', 'el-icon-arrow-down']} />
          </div>
        </div>
      </Tooltip>
    );
  }
});

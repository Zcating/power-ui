import { vi } from 'power-ui/lang';
import { defineComponent, ref } from 'vue';
import { Tooltip } from '../tooltip';
import { Pallet } from './pallet';

export const ColorPicker = defineComponent({
  props: {

  },
  setup(props, ctx) {
    const visible = ref(false);
    return () => (
      <Tooltip
        v-model={visible.value}
        popperClass={'el-color-dropdown el-color-picker__panel'}
        placement={'bottom'}
        trigger={'custom'}
        v-slots={{
          content: () => <Pallet />
        }}
      >
        <div class={['el-color-picker', 'el-color-picker--default']} onClick={() => visible.value = !visible.value}>
          <div class="el-color-picker__trigger">
            <span class="el-color-picker__color">
              <span class="el-color-picker__color-inner" style={{}} />
            </span>
            <span class={['el-color-picker__icon', 'el-icon-arrow-down']} />
          </div>
        </div>
      </Tooltip>
    );
  }
});

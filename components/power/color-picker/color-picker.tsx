import { defineComponent } from 'vue';
import { Tooltip } from '../tooltip';
import { Pallet } from './pallet';

export const ColorPicker = defineComponent({
  props: {

  },
  setup(props, ctx) {
    return () => (
      <Tooltip
        popperClass={'el-color-dropdown el-color-picker__panel'}
        placement={'bottom'}
        trigger={'click'}
        v-slots={{
          content: () => <Pallet />
        }}
      >
        <div class={['el-color-picker', 'el-color-picker--default']}>
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

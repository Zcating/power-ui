import { defineComponent, ref, renderSlot, toRef, watch } from 'vue';
import { OptionService } from './option.service';

export const OptionGroup = defineComponent({
  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const service = new OptionService();

    const visible = ref(false);

    watch(toRef(props, 'disabled'), (value) => service.setDisabled(value));

    service.watchInputValue((value) => {
      
    });


    return { visible };
  },
  render() {
    const { $slots, label, visible } = this;
    return (
      <ul class="el-select-group__wrap" v-show={visible}>
        <li class="el-select-group__title">{label}</li>
        <li>
          <ul class="el-select-group">
            {renderSlot($slots, 'default')}
          </ul>
        </li>
      </ul>
    );
  }
});

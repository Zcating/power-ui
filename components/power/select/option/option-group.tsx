import { defineComponent, ref, renderSlot } from 'vue';

export const OptionGroup = defineComponent({
  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const visible = ref(false);

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

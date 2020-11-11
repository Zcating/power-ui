import { defineComponent, renderSlot } from 'vue';

export const ButtonGroup = defineComponent({
  name: "ele-button-group",
  setup(_, ctx) {
    return () => (
      <div class='el-button-group'>{renderSlot(ctx.slots, "default")}</div>
    );
  },
});
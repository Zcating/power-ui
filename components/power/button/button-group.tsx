import { defineComponent } from 'vue';

export const ButtonGroup = defineComponent({
  name: 'ele-button-group',
  setup(_, ctx) {
    return () => (
      <div class='el-button-group'>{ctx.slots.default?.()}</div>
    );
  },
});
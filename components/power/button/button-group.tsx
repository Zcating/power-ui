import { defineComponent } from 'vue';

export const ButtonGroup = defineComponent({
  name: 'po-button-group',
  setup(_, ctx) {
    return () => (
      <div class='el-button-group'>{ctx.slots.default?.()}</div>
    );
  },
});
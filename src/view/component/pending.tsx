import { defineComponent } from 'vue';

export const Pending = defineComponent({
  setup() {
    return () => (
      <div>敬请期待（Please Waiting）</div>
    );
  },
});
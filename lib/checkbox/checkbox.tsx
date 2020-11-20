import { defineComponent } from 'vue';

export const Checkbox = defineComponent({
  props: {
    value: {}
  },
  setup(_, ctx) {
    return () => (<></>);
  }
});

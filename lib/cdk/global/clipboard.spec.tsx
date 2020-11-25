import { defineComponent, ref } from 'vue';
import { useClipboard } from '.';

export default defineComponent({
  name: 'clipboard-spec',
  setup() {
    const test = ref('test copy');
    const clipboard = useClipboard();
    const clip = () => {
      clipboard.copy(test.value);
    };
    return () => (
      <>
        <textarea v-model={test.value} />
        <button onClick={clip}>clip</button>
      </>
    );
  },
});

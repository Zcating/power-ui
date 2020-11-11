import { defineComponent, inject, ref } from "vue";
import { clipboardToken } from ".";

export default defineComponent({
  name: "clipboard-spec",
  setup() {
    const test = ref("test copy");
    const clipboard = inject(clipboardToken)!;
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

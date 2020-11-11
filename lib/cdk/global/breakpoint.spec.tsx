import { defineComponent, inject } from "vue";
import { breakpointToken } from ".";

export default defineComponent({
  name: "breakpoint-spec",
  setup() {
    const bp = inject(breakpointToken)!;
    return () => (
      <div>
        <p>span: {bp.span.value}</p>
        <p>direction: {bp.direction.value}</p>
      </div>
    );
  },
});

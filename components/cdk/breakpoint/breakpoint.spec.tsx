import { defineComponent } from 'vue';
import { useBreakpoint } from '.';

export default defineComponent({
  name: 'breakpoint-spec',
  setup() {
    const bp = useBreakpoint();
    return () => (
      <div>
        <p>span: {bp.span}</p>
        <p>direction: {bp.direction}</p>
      </div>
    );
  },
});

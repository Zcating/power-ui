import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { PowerViewProvider } from 'power-ui';



export default defineComponent({
  name: 'power-app',
  setup() {
    return () => (
      <PowerViewProvider>
        <RouterView />
      </PowerViewProvider>
    );
  },
});

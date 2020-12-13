import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { PowerModule } from 'power-ui';



export default defineComponent({
  name: 'power-app',
  setup() {
    return () => (
      <PowerModule>
        <RouterView />
      </PowerModule>
    );
  },
});

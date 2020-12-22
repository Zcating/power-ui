import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { Layout } from '../layout';

export const ComponentDoc = defineComponent({
  setup(_, ctx) {
    return () => <Layout>
      <RouterView />
    </Layout>;
  },
});
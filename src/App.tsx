import { defineComponent,renderList } from "vue";
import { RouterView } from "vue-router";
import { globalInject, EleUIProvider } from "../lib";

const App = defineComponent({
  name: "el-app",
  setup() {
    return () => <RouterView />;
  },
});

export default defineComponent({
  name: "element-app",
  setup() {
    globalInject();
    return () => (
      <EleUIProvider>
        <App />
      </EleUIProvider>
    );
  },
});

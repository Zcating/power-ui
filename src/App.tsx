import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { EleUIProvider } from "../lib";

const App = defineComponent({
  name: "el-app",
  setup() {
    return () => <RouterView />;
  },
});

export default defineComponent({
  name: "element-app",
  setup() {
    return () => (
      <EleUIProvider>
        <App />
      </EleUIProvider>
    );
  },
});

import { createApp } from "vue";
import App from "./App";
import "../lib/theme-chalk/src/index.scss";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");

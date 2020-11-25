import { createApp } from 'vue';
import App from './App';
import router from './router';
import 'power-ui/theme-chalk/src/index.scss';
const app = createApp(App);
app.use(router);
app.mount('#app');

import { createApp } from 'vue';
import App from './App';
import router from './router';
import '../lib/theme-chalk/src/index.scss';
const app = createApp(App);
app.use(router);
app.mount('#app');

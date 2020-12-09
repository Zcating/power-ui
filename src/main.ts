import { createApp } from 'vue';
import App from './App';
import router from './router';
import { cdk } from 'vue-cdk/global';
import { message, notification } from 'power-ui';
import 'power-ui/theme-chalk/src/index.scss';

const app = createApp(App);
app.use(cdk);
app.use(router);
app.use(message);
app.use(notification);
app.mount('#app');

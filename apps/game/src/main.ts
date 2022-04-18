import store from './store';
import { createApp } from 'vue';
import App from './App.vue';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

createApp(App).use(store).mount('#app');

import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import router from './routes';
import store from './Store/store';

import vuelidate from 'vuelidate';

import Button from './components/UI/Button.vue';
import { MdCard } from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';

Vue.component('app-button', Button);

Vue.use(MdCard);

Vue.use(VueResource);
Vue.http.options.root = '';

Vue.use(vuelidate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

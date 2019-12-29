import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import router from './routes';
import store from './Store/store';

import vuelidate from 'vuelidate';

import wysiwyg from 'vue-wysiwyg';

import Button from './components/UI/Button.vue';
import {
  MdCard,
  MdContent,
  MdButton,
  MdDialog
} from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';

Vue.component('app-button', Button);

Vue.use(MdCard);
Vue.use(MdContent);
Vue.use(MdButton);
Vue.use(MdDialog);

Vue.use(VueResource);
Vue.http.options.root = 'https://v-gamespot.firebaseio.com/';

Vue.use(vuelidate);
Vue.use(wysiwyg, {});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

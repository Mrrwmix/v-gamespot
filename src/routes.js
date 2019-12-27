import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './components/Home/Index.vue';

Vue.use(VueRouter);

const routes = [{ path: '/', component: Home }];

export default new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

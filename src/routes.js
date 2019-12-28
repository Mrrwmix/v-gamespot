import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './Store/store';

import Home from './components/Home/Index.vue';
import Signin from './components/Signin/Index.vue';
import Dashboard from './components/Dashboard/Index.vue';
import MainDashboard from './components/Dashboard/Main.vue';
import AddPost from './components/Dashboard/AddPosts.vue';
import ManagePosts from './components/Dashboard/ListPosts.vue';

Vue.use(VueRouter);

const authGuard = {
  beforeEnter: (to, from, next) => {
    const redirect = () => {
      if (store.state.admin.token) {
        if (to.path === '/signin') {
          next('/dashboard');
        } else {
          next();
        }
      } else {
        if (to.path === '/signin') {
          next();
        } else {
          next('/');
        }
      }
    };

    if (store.state.admin.refreshLoading) {
      //async code, observer
      store.watch(
        (state, getters) => getters['admin/refreshLoading'],
        () => {
          redirect();
        }
      );
    } else {
      redirect();
    }
  }
};

const routes = [
  { path: '/', component: Home },
  { path: '/signin', component: Signin, ...authGuard },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '/', component: MainDashboard },
      { path: 'add_post', component: AddPost },
      { path: 'posts_list', component: ManagePosts }
    ],
    ...authGuard
  }
];

export default new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

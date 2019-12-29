/*eslint-disable*/
import Vue from 'vue';
import router from '../../routes';

const FbAuth = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const FbKey = 'AIzaSyAZrwqBT376t0dj3Jva3IgXttCjTR_2vMk';

const admin = {
  namespaced: true,
  state: {
    token: null,
    refresh: null,
    authFailed: false,
    refreshLoading: true,
    addpost: false,
    imageUpload: null,
    adminPosts: null
  },
  getters: {
    isAuth(state) {
      if (state.token) {
        return true;
      }
      return false;
    },
    refreshLoading(state) {
      return state.refreshLoading;
    },
    addPostStatus(state) {
      return state.addpost;
    },
    imageUpload(state) {
      return state.imageUpload;
    },
    getAdminPosts(state) {
      return state.adminPosts;
    }
  },
  mutations: {
    authUser(state, authData) {
      state.token = authData.idToken;
      state.refresh = authData.refreshToken;

      if (authData.type === 'signin') {
        router.push('/dashboard');
      }
    },
    authFailed(state, type) {
      if (type === 'reset') {
        state.authFailed = false;
      } else {
        state.authFailed = true;
      }
    },
    logoutUser(state) {
      state.token = null;
      state.refresh = null;

      localStorage.removeItem('token');
      localStorage.removeItem('refresh');

      router.push('/');
    },
    refreshLoading(state) {
      state.refreshLoading = false;
    },
    addPost(state) {
      state.addpost = true;
    },
    clearAddPost(state) {
      state.addpost = false;
    },
    imageUpload(state, imageData) {
      state.imageUpload = imageData.secure_url;
    },
    clearImageUpload(state) {
      state.imageUpload = null;
    },
    getAdminPosts(state, posts) {
      state.adminPosts = posts;
    }
  },
  actions: {
    signIn({ commit }, payload) {
      console.log(payload);
      Vue.http
        .post(`${FbAuth}signInWithPassword?key=${FbKey}`, {
          ...payload,
          returnSecureToken: true
        })
        .then(response => response.json())
        .then(authData => {
          commit('authUser', {
            ...authData,
            type: 'signin'
          });

          localStorage.setItem('token', authData.idToken);
          localStorage.setItem('refresh', authData.refreshToken);
        })
        .catch(error => {
          commit('authFailed');
        });
    },
    refreshToken({ commit }) {
      const refreshToken = localStorage.getItem('refresh');

      if (refreshToken) {
        Vue.http
          .post(`https://securetoken.googleapis.com/v1/token?key=${FbKey}`, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          })
          .then(response => response.json())
          .then(authData => {
            commit('authUser', {
              idToken: authData.id_token,
              refreshToken: authData.refresh_token,
              type: 'refresh'
            });
            commit('refreshLoading');

            localStorage.setItem('token', authData.id_token);
            localStorage.setItem('refresh', authData.refresh_token);
          });
      } else {
        commit('refreshLoading');
      }
    },
    addPost({ commit, state }, payload) {
      Vue.http
        .post(`posts.json?auth=${state.token}`, payload)
        .then(response => response.json())
        .then(resp => {
          commit('addPost');
          setTimeout(() => {
            commit('clearAddPost');
          }, 3000);
        });
    },
    imageUpload({ commit }, file) {
      const CLOUDINARY_URL =
        'https://api.cloudinary.com/v1_1/mirthew/image/upload';
      const CLOUDINARY_PRESET = 'dlffg79a';

      let formData = new FormData();

      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_PRESET);

      Vue.http
        .post(CLOUDINARY_URL, formData, {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => response.json())
        .then(resp => {
          commit('imageUpload', resp);
        });
    },
    getAdminPosts({ commit }) {
      Vue.http
        .get('posts.json')
        .then(response => response.json())
        .then(resp => {
          const posts = [];
          for (let key in resp) {
            posts.push({
              ...resp[key],
              id: key
            });
          }
          commit('getAdminPosts', posts.reverse());
        });
    },
    deletePost({ commit, state }, payload) {
      Vue.http
        .delete(`posts/${payload}.json?auth=${state.token}`)
        .then(response => {
          let newPosts = [];
          state.adminPosts.forEach(post => {
            if (post.id !== payload) {
              newPosts.push(post);
            }
          });
          commit('getAdminPosts', newPosts);
        });
    }
  }
};

export default admin;

/*eslint-disable*/
import Vue from 'vue';

const FbAuth = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const FbKey = 'AIzaSyAZrwqBT376t0dj3Jva3IgXttCjTR_2vMk';

const admin = {
  namespaced: true,
  state: {
    token: null,
    refresh: null,
    authFailed: false
  },
  getters: {},
  mutations: {
    authUser(state, authData) {
      state.token = authData.idToken;
      state.refresh = authData.refreshToken;
    },
    authFailed(state, type) {
      if (type === 'reset') {
        state.authFailed = false;
      } else {
        state.authFailed = true;
      }
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
    }
  }
};

export default admin;

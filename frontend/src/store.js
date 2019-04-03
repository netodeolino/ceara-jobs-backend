import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    token: window.localStorage.getItem("token") || null,
    pathImage: window.localStorage.getItem("setPathImage") || null,
    userId: window.localStorage.getItem("setUserId") || null
  },
  getters: {
    isLogged: state => {
      return state.token != null;
    },
    getPathImage: state => {
      return state.pathImage;
    },
    getUserId: state => {
      return state.userId;
    }
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    setPathImage(state, payload) {
      state.pathImage = payload;
    },
    setUserId(state, payload) {
      state.userId = payload;
    }
  },
  actions: {
    login({ commit }, token) {
      commit("setToken", token);
    },
    logout({ commit }) {
      commit("setToken", null);
    },
    setPathImage({ commit }, pathImage) {
      commit("setPathImage", pathImage);
    },
    setUserId({ commit }, userId) {
      commit("setUserId", userId);
    }
  }
});

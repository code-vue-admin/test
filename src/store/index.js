import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapse:false,
  },
  getters:{},
  mutations: {
    SET_COLLAPSE(state){
      state.isCollapse = !state.isCollapse
      console.log(state.isCollapse)
    },
  },
  actions: {},
  modules: {}
});

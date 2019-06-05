import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: {},
    selectedItem: {}
  },
  mutations: {
    loadItems: function(state, items) {
      state.items = items;
    },
    selectItem: function(state, item) {
      state.selectedItem = item;
    }
  }
});

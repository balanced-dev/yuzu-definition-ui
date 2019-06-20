import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: {},
    selectedItem: {},
    selectedBlockState: {},
    blockData: {},
    navItems: [
      'Blocks',
      'Context',
      'Data'
    ],
    navContext: 'Context'
  },
  mutations: {
    loadItems: function(state, items) {
      state.items = items;
    },
    loadBlockData: function(state, blockData) {
      state.blockData = blockData;
    },
    saveBlockData: function(state, data) {
      state.blockData.data = data;
    },
    selectItem: function(state, item) {
      state.selectedItem = item;
    },
    setBlockState: function(state, blockState) {
      state.selectedBlockState = blockState;
    },
    setNavContext: function(state, navContext)
    {
      state.navContext = navContext;
    }
  }
});

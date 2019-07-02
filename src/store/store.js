import Vue from "vue";
import Vuex from "vuex";

import moduleNav from "./modules/nav";
import moduleBlockPaths from "./modules/blockPaths";
import moduleBlocks from "./modules/blocks";
import moduleBlockStates from "./modules/blockStates";
import moduleState from "./modules/state";
import moduleData from "./modules/data";
import moduleItemTitle from "./modules/itemTitle";
import moduleWebSocket from "./modules/websocket";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { 
    toPreview: false
  },
  mutations: { 
    triggerPreview: function(state) {
      state.toPreview = true;
    },
    resetPreview: function(state) {
      state.toPreview = false;
    }
  },
  actions: {
  },
  modules: {
    nav: moduleNav,
    blockPaths: moduleBlockPaths,
    blocks: moduleBlocks,
    blockStates: moduleBlockStates,
    state: moduleState,
    data: moduleData,
    itemTitle: moduleItemTitle,
    ws: moduleWebSocket
  }
});

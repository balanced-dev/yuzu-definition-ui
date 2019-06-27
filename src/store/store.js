import Vue from "vue";
import Vuex from "vuex";

import moduleNav from "./modules/nav";
import moduleBlocks from "./modules/blocks";
import moduleBlockStates from "./modules/blockStates";
import moduleState from "./modules/state";
import moduleData from "./modules/data";
import moduleWebSocket from "./modules/websocket";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { 
  },
  mutations: { 
  },
  actions: {
  },
  modules: {
    nav: moduleNav,
    blocks: moduleBlocks,
    blockStates: moduleBlockStates,
    state: moduleState,
    data: moduleData,
    ws: moduleWebSocket
  }
});

import Vue from "vue";
import Vuex from "vuex";

import moduleNav from "./modules/nav";
import moduleBlocks from "./modules/blocks";
import moduleBlockStates from "./modules/blockStates";
import moduleState from "./modules/state";
import moduleData from "./modules/data";
import moduleSchema from "./modules/schema";
import moduleItemTitle from "./modules/itemTitle";
import moduleWebSocket from "./modules/websocket";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { 
    toPreview: false,
    packageVersion: process.env.PACKAGE_VERSION || '0'
  },
  mutations: { 
    triggerPreview: function(state) {
      state.toPreview = true;
    },
    resetPreview: function(state) {
      state.toPreview = false;
    }
  },
  getters: {
    appVersion: (state) => {
      return state.packageVersion
    }
  },
  actions: {
  },
  modules: {
    nav: moduleNav,
    blocks: moduleBlocks,
    blockStates: moduleBlockStates,
    state: moduleState,
    data: moduleData,
    schema: moduleSchema,
    itemTitle: moduleItemTitle,
    ws: moduleWebSocket
  }
});

import api from "../../api";
import _ from "lodash";
import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    root: {},
    refs: {},
    paths: {}
  },
  mutations: {
    loadAll: function (state, data) {
      state.root = data.data;
      state.refs = data.map;
      state.paths = data.paths;
    },
    saveRoot: function (state, root) {
      state.root = root;
    },
    saveRef: function (state, payload) {
      state.refs[payload.state] = payload.data;
    },
  },
  actions: {
    load(context) {
      var currentBlock = context.rootState.blocks.current.name;
      var currentState = context.rootState.state.current.name;
      if(currentState) {
        api.getWithRefs(currentBlock, currentState)
        .then(response => {
          context.commit("loadAll", response.data);
        });
      }
    },
    saveRoot(context, root) {
      context.commit("saveRoot", root);
    },
    saveRef(context, payload) {
      context.commit("saveRef", payload);
    }
  }
};

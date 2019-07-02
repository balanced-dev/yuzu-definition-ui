import api from "../../api";
import _ from "lodash";

export default {
  namespaced: true,
  state: {
    root: {},
    refs: {}
  },
  mutations: {
    load: function (state, data) {
      state.root = data;
    },
    save: function (state, root) {
      state.root = root;
    }
  },
  actions: {
    load(context) {
      var state = context.rootState.state.current.name;
      if(state) {
        api.get(state)
        .then(response => {
          context.commit("load", response.data);
        });
      }
    },
    save(context, root) {
      context.commit("save", root);
    }
  }
};

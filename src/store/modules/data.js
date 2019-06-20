import axios from "axios";
import _ from "lodash";
import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    root: {},
    refs: {}
  },
  mutations: {
    loadAll: function (state, data) {
      state.root = data.data;
      state.refs = data.map;
    },
    saveRoot: function (state, root) {
      state.root = root;
    },
    saveRef: function (state, payload) {
      state.refs["/"+ payload.state] = payload.data;
    },
  },
  actions: {
    load(context) {
      var currentState = context.rootState.state.current.name;
      if(currentState) {
        axios.get("http://localhost:3000/api/getWithRefs/"+ currentState)
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

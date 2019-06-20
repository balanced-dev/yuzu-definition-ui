import axios from "axios";
import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    items: {},
    current: {}
  },
  mutations: {
    load: function(state, items) {
      state.items = items;
    },
    setCurrent: function(state, item) {
      state.current = item;
    }
  },
  actions: {
    load(context) {
      axios.get("/_templates/templates.json").then(response => {
        var items = response.data;

        context.commit("load", items);

        var route = bootstrap.getRoute();
        if(!route) route = "content";
  
        var appContext = {};
        bootstrap.getBlockAndState(items, route, appContext);
        context.commit("setCurrent", appContext.block);
        context.commit("state/setCurrent", appContext.state, { root: true });
      });
    }
  }
};

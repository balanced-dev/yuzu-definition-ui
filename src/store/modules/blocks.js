import api from "../../api";
import bootstrap from "../../bootstrap";
import _ from "lodash";

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
      api.getPreviews().then(response => {
        var items = response.data;

        context.commit("load", items);

        var route = bootstrap.getRoute();
        var appContext = {};

        bootstrap.getBlockAndState(items, route, appContext);

        if(!appContext.state && items.pages) {
          route = _.first(Object.keys(items.pages));
          bootstrap.getBlockAndState(items, route, appContext);
        }
  
        context.commit("setCurrent", appContext.block);
        context.commit("state/setCurrent", appContext.state, { root: true });
        context.dispatch("data/load", appContext.state.name, { root: true });
        context.dispatch("schema/load", appContext.block.name, { root: true });
        context.dispatch("state/loadAll", appContext.state.name, { root: true });
      });
    }
  }
};

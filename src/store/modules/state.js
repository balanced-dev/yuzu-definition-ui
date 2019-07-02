import api from "../../api";
import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    current: {},
    objectSetttings: {},
    items: []
  },
  getters: {
    previewUrlToDataPath: state => {
      return bootstrap.convertPreviewToDataPath(state.current.url);
    },
    has: (state) => (s) => {
      return _.find(state.items, function(item) {
        return item.name == s; 
      });
    },
    get: (state) => (s) => {
      var d = _.chain(state.items).filter(function(item) {
        return item.name == s; 
      }).first().value();
      if(d)
        return d.state;
      else
        return [];
    }
  },
  mutations: {
    setCurrent: function(state, current) {
      state.current = current;
    },
    load: function (state, data) {
      state.items = data.items;
    },
    add: function (state, data) {
      state.items.push(data);
    },
    update: function (state, data) {
      state.items.forEach(item => {
        if(item.name == data.name) {
          item.state = data.state;
        }
      });
    }
  },
  actions: {
    loadAll(context, state) {
      if(state) {
        api.getChildStates(state)
        .then(response => {
          context.commit("load", response.data);
        });
      }
    },
    load(context, refString) {
      if(!context.getters["has"](refString)) {
        api.get(refString)
        .then(response => {
          context.commit("add", {
            name: refString,
            state: response.data
          });
        });
      }
    },
    add(context, payload) {
      context.commit("add", payload);
    },
    update(context, payload) {
      context.commit("update", payload);
    }
  }
};
